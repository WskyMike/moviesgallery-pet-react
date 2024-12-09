/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getAuth,
  updateProfile,
  updateEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";
import { useToast } from "../../contexts/ToastProvider";

const REGEX_EMAIL =
  /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;

function ProfileModal({ show, onHide }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const [user, setUser] = useState(null);
  const [registrationDate, setRegistrationDate] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // для дизейбла кнопки подтверждения
  const { triggerToast } = useToast();

  const auth = getAuth();

  // Получаем данные об аккаунте.
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      reset();
      setUser(currentUser);
      setValue("email", currentUser.email);
      setValue("name", currentUser.displayName || "");
      setRegistrationDate(
        new Date(currentUser.metadata.creationTime).toLocaleDateString()
      );
      setEmailVerified(currentUser.emailVerified);
    }
  }, [show, setValue, auth, reset]);

  // Проверка статуса верификации почты пользователя
  useEffect(() => {
    let interval;
    let timeout;

    if (isVerifying) {
      interval = setInterval(() => {
        auth.currentUser.reload().then(() => {
          if (auth.currentUser.emailVerified) {
            setEmailVerified(true);
            setIsVerifying(false);
            clearInterval(interval);
            clearTimeout(timeout);
            triggerToast(
              "Ваш email успешно подтвержден!",
              "success-subtle",
              "success-emphasis",
              "top-center"
            );
          }
        });
      }, 5000);

      timeout = setTimeout(() => {
        setIsVerifying(false);
        clearInterval(interval);
      }, 180000); // 3 минуты
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVerifying, auth, triggerToast]);

  // Следим за изменениями в аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmailVerified(user.emailVerified);
      }
    });
    return () => unsubscribe();
  }, [auth, show]);

  // Царь-блок
  const onSubmit = async (data) => {
    try {
      if (user) {
        const isEmailChanged = data.email !== user.email;
        const isNameChanged = data.name !== user.displayName;

        // Если нет изменений — просто закрываем модалку
        if (!isEmailChanged && !isNameChanged) {
          onHide();
          return;
        }

        // Обновляем только имя
        if (isNameChanged && !isEmailChanged) {
          await updateProfile(user, { displayName: data.name });
          triggerToast(
            "Имя пользователя успешно изменено.",
            "success-subtle",
            "success-emphasis",
            "top-center"
          );
          setUser((prevUser) => ({
            ...prevUser,
            displayName: data.name,
          }));
          return;
        }

        // Проверяем подтверждён ли текущий email, если изменена почта
        if (isEmailChanged && !user.emailVerified) {
          triggerToast(
            "Пожалуйста, подтвердите ваш текущий email перед изменением.",
            "danger-subtle",
            "danger-emphasis",
            "top-center"
          );
          // Сбрасываем поле email к старому значению
          setValue("email", user.email);
          return;
        }

        // Если почта изменена и текущая почта подтверждена
        if (isEmailChanged && user.emailVerified) {
          await updateEmail(user, data.email);
          await sendEmailVerification(user);
          triggerToast(
            "Email успешно обновлен и отправлено письмо для подтверждения.",
            "success-subtle",
            "success-emphasis",
            "top-center"
          );
          onHide();
        }
      }
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      triggerToast(
        "Ошибка при обновлении профиля. Попробуйте немного позже.",
        "danger-subtle",
        "danger-emphasis",
        "top-center"
      );
      if (error.code === "auth/requires-recent-login" && show) {
        triggerToast(
          "Для изменения почты требуется повторная аутентификация. Пожалуйста, войдите заново.",
          "danger-subtle",
          "danger-emphasis",
          "top-center"
        );
      }
    }
  };

  // Письмо с верификацией
  const handleSendEmailVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        setIsVerifying(true);
        triggerToast(
          "Письмо для подтверждения отправлено на ваш email.",
          "info-subtle",
          "info-emphasis",
          "top-center"
        );
      } catch (error) {
        console.error("Ошибка при отправке письма для подтверждения:", error);
        triggerToast(
          "Ошибка при отправке письма для подтверждения. Попробуйте немного позже.",
          "danger-subtle",
          "danger-emphasis",
          "top-center"
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onHide();
      triggerToast(
        "Вы вышли из аккаунта.",
      );
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
      triggerToast(
        "Ошибка при выходе из аккаунта.",
        "danger-subtle",
        "danger-emphasis",
        "top-center"
      );
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="text-start p-4 d-flex justify-content-between">
          <h4>Привет, {user?.displayName || "Username"}!</h4>
          <button
            type="button"
            className="btn-close"
            aria-label="Закрыть"
            onClick={() => onHide()}
          ></button>
        </div>

        <div className="p-4 text-start">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group
              as={Row}
              className={`${errors.email ? "mb-1" : "mb-4"}`}
            >
              <Col xs="5">
                <Form.Label column className="text-secondary">
                  Почта:
                </Form.Label>
              </Col>
              <Col xs="7">
                <Form.Control
                  type="email"
                  className={`text-end ${errors.email ? "is-invalid" : ""}`}
                  {...register("email", {
                    required: "Email обязателен",
                    pattern: {
                      value: REGEX_EMAIL,
                      message: "Неверный формат email",
                    },
                  })}
                />
                <Form.Control.Feedback className="text-start" type="invalid">
                  {errors.email && errors.email.message}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className={`${errors.name ? "mb-0" : "mb-4"}`}>
              <Col xs="5">
                <Form.Label column className="text-secondary">
                  Имя:
                </Form.Label>
              </Col>
              <Col xs="7">
                <Form.Control
                  type="text"
                  className={`text-end ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Имя обязательно",
                    minLength: {
                      value: 2,
                      message: "Минимум 2 символа",
                    },
                    maxLength: {
                      value: 20,
                      message: "Максимум 20 символов",
                    },
                  })}
                />
                <Form.Control.Feedback className="text-start" type="invalid">
                  {errors.name && errors.name.message}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Col xs="5">
                <Form.Label column className="text-secondary">
                  Дата регистрации:
                </Form.Label>
              </Col>
              <Col xs="7">
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={registrationDate}
                  className="text-end"
                />
              </Col>
            </Form.Group>
            <div className="pt-5 pb-3 d-grid col-8 mx-auto">
              <Button
                variant={
                  emailVerified
                    ? "outline-secondary"
                    : isVerifying
                    ? "outline-secondary"
                    : "secondary"
                }
                onClick={
                  !emailVerified && !isVerifying
                    ? handleSendEmailVerification
                    : null
                }
                disabled={emailVerified || isVerifying}
              >
                {emailVerified
                  ? "Email подтвержден"
                  : isVerifying
                  ? "Проверка подтверждения . . ."
                  : "Подтвердить email"}
              </Button>
            </div>
            <div className="pb-2 pb-3 d-grid col-8 mx-auto">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : "Сохранить"}{" "}
              </Button>
            </div>
            <div className="pb-2 d-grid col-8 mx-auto">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default ProfileModal;
