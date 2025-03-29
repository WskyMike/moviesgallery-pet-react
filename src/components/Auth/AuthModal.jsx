/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../utils/firebase';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { useToast } from '../../contexts/ToastProvider';

import './AuthModal.css';

const REGEX_EMAIL =
  /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;

function AuthModal({
  show,
  onHide,
  formType,
  switchToOther,
  buttonText,
  switchText,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const { triggerToast } = useToast();

  useEffect(() => {
    reset();
  }, [switchToOther]);

  const onSubmit = async (data) => {
    try {
      if (formType === 'register') {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: data.name });
      } else if (formType === 'login') {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      onHide();
      triggerToast('Добро пожаловать!', 'success');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        triggerToast(
          'Неверный e-mail или пароль',
          'danger-subtle',
          'danger-emphasis',
          'top-center'
        );
      } else if (error.code === 'auth/email-already-in-use') {
        triggerToast(
          'Пользователь с таким e-mail уже зарегистрирован',
          'danger-subtle',
          'danger-emphasis',
          'top-center'
        );
      } else {
        triggerToast(
          'Ошибка авторизации',
          'danger-subtle',
          'danger-emphasis',
          'top-center'
        );
      }
    }
  };

  // Для отслеживания значения поля "password" и его сравнения с полем "confirmPassword"
  const password = watch('password');

  return (
    <>
      <Modal
        className="auth-modal"
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <div className="text-start p-4 d-flex justify-content-between">
          <h4>{formType === 'login' ? 'Рады видеть!' : 'Добро пожаловать!'}</h4>
          <button
            type="button"
            className="btn-close"
            aria-label="Закрыть"
            onClick={() => onHide()}></button>
        </div>
        <div className="p-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {formType === 'register' && (
              <FloatingLabel
                controlId="floatingName"
                label="Имя"
                className={`d-grid col-8 mx-auto ${
                  errors.name ? 'gap-0 mb-2 is-invalid' : 'mb-4'
                }`}>
                <Form.Control
                  type="text"
                  placeholder="Введите ваше имя"
                  {...register('name', {
                    required: 'Имя обязательно',
                    minLength: {
                      value: 2,
                      message: 'Имя должно быть не менее 2 символов',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Имя должно быть не более 20 символов',
                    },
                  })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback className="text-start" type="invalid">
                  {errors.name && errors.name.message}
                </Form.Control.Feedback>
              </FloatingLabel>
            )}
            <FloatingLabel
              controlId="floatingInput"
              label="Email"
              className={`d-grid col-8 mx-auto ${
                errors.email ? 'gap-0 mb-2 is-invalid' : 'mb-4'
              }`}>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: REGEX_EMAIL,
                    message: 'Неверный формат email',
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback className="text-start" type="invalid">
                {errors.email && errors.email.message}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPassword"
              label="Пароль"
              className={`d-grid col-8 mx-auto ${
                errors.password ? 'gap-0 mb-2 is-invalid' : 'mb-4'
              }`}>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Пароль должен быть не менее 6 символов',
                  },
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback className="text-start" type="invalid">
                {errors.password && errors.password.message}
              </Form.Control.Feedback>
            </FloatingLabel>
            {formType === 'register' && (
              <FloatingLabel
                controlId="floatingConfirmPassword"
                label="Проверим пароль"
                className={`d-grid col-8 mx-auto ${
                  errors.confirmPassword ? 'gap-0 mb-2 is-invalid' : 'mb-4'
                }`}>
                <Form.Control
                  type="password"
                  placeholder="Подтвердите пароль"
                  {...register('confirmPassword', {
                    required: 'Подтверждение пароля обязательно',
                    validate: (value) =>
                      value === password || 'Пароли не совпадают',
                  })}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback className="text-start" type="invalid">
                  {errors.confirmPassword && errors.confirmPassword.message}
                </Form.Control.Feedback>
              </FloatingLabel>
            )}
            <div className="py-4 d-grid gap-3 col-8 mx-auto">
              <Button type="submit" disabled={isSubmitting}>
                {buttonText}
              </Button>
              <small
                className="text-secondary text-center"
                style={{ cursor: 'pointer' }}
                onClick={switchToOther}>
                {switchText}
              </small>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default AuthModal;
