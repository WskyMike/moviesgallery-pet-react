import { useState } from 'react';
import { Container, Navbar, Button, Nav } from 'react-bootstrap';
import {
  CameraReels,
  PersonFill,
  BookmarkStarFill,
} from 'react-bootstrap-icons';
import './Navibar.css';
import AuthModal from '../Auth/AuthModal';
import ProfileModal from '../Profile/ProfileModal';

import { auth } from '../../utils/firebase'; // Для логики выхода
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastProvider';

function NaviBar() {
  const [modalType, setModalType] = useState(null); // null, 'register', 'login'
  const { user, authLoading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { triggerToast } = useToast();

  const handleClose = () => setModalType(null);

  const handleSwitchToLogin = () => setModalType('login');
  const handleSwitchToRegister = () => setModalType('register');

  const handleOpenProfileModal = () => setShowProfileModal(true);
  const handleCloseProfileModal = () => setShowProfileModal(false);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        triggerToast('Вы вышли из аккаунта.');
      })
      .catch((error) => {
        console.error('Ошибка при выходе из аккаунта:', error);
        triggerToast(
          'Ошибка при выходе из аккаунта.',
          'danger-subtle',
          'danger-emphasis',
          'top-center'
        );
      });
  };

  return (
    <>
      <Navbar
        expand="sm"
        className="custom-navibar bg-body-tertiary"
        data-bs-theme="light">
        <Container fluid>
          <Navbar.Brand href="/" className="fs-2 me-5">
            Киногалерея &nbsp;
            <CameraReels className="navibar-icon" />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="border-0"
          />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-start ps-lg-5 my-4 my-sm-0">
            {authLoading ? (
              <div
                className="spinner-border spinner-border-sm text-dark"
                role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            ) : (
              <>
                {/* {user && (
                  <span className="me-3">
                    Привет, {user.displayName || "Пользователь"}!
                  </span>
                )} */}

                <Nav className="me-auto row-gap-2">
                  {user && (
                    <>
                      <Nav.Link
                        href="/my"
                        className="text-primary icon-link icon-link-hover justify-content-center"
                        style={{
                          '--bs-icon-link-transform':
                            'translate3d(0, -.125rem, 0)',
                        }}>
                        <BookmarkStarFill aria-hidden="true" />
                        Мои закладки
                      </Nav.Link>
                      <Nav.Link
                        onClick={handleOpenProfileModal}
                        className="text-primary icon-link icon-link-hover justify-content-center"
                        style={{
                          '--bs-icon-link-transform':
                            'translate3d(0, -.125rem, 0)',
                        }}>
                        <PersonFill aria-hidden="true" />
                        Аккаунт
                      </Nav.Link>
                    </>
                  )}
                </Nav>

                {user ? (
                  <Button
                    className="mt-4 mt-sm-0"
                    variant="outline-primary"
                    onClick={handleSignOut}>
                    Выйти
                  </Button>
                ) : (
                  <div className="">
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="mx-2"
                      onClick={handleSwitchToRegister}>
                      Регистрация
                    </Button>
                    <Button
                      variant="primary"
                      className=""
                      onClick={handleSwitchToLogin}>
                      Войти
                    </Button>
                  </div>
                )}
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Унифицированное модальное окно для реги/входа */}
      {modalType && (
        <AuthModal
          show={modalType !== null}
          onHide={handleClose}
          formType={modalType}
          switchToOther={
            modalType === 'login' ? handleSwitchToRegister : handleSwitchToLogin
          }
          buttonText={modalType === 'login' ? 'Войти' : 'Зарегистрироваться'}
          switchText={
            modalType === 'login' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'
          }
        />
      )}
      <ProfileModal show={showProfileModal} onHide={handleCloseProfileModal} />
    </>
  );
}

export default NaviBar;
