import { useState, lazy, Suspense } from 'react';
import { Container, Navbar, Button, Nav } from 'react-bootstrap';
import {
  CameraReels,
  PersonFill,
  BookmarkStarFill,
} from 'react-bootstrap-icons';
import './Navibar.css';

import AuthModalLoader from '../Auth/AuthModalLoader';
const ProfileModal = lazy(() => import('../Profile/ProfileModal'));

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastProvider';

function NaviBar() {
  const [modalType, setModalType] = useState(null); // null, 'register', 'login'
  const [isLoadingModal, setIsLoadingModal] = useState(false); // Для анимации lazy загрузки
  const { user, authLoading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { triggerToast } = useToast();

  const handleOpenProfileModal = () => setShowProfileModal(true);
  const handleCloseProfileModal = () => setShowProfileModal(false);

  const handleSignOut = async () => {
    try {
      const { getAuthInstance } = await import('../../utils/firebase/firebase'); // динамический импорт экземпляра auth
      const auth = await getAuthInstance();
      await auth.signOut();
      triggerToast('Вы вышли из аккаунта.');
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
      triggerToast(
        'Ошибка при выходе из аккаунта.',
        'danger-subtle',
        'danger-emphasis',
        'top-center'
      );
    }
  };

  // Обработчик открытия модального окна
  const handleOpenModal = (type) => {
    setIsLoadingModal(true);
    setModalType(type);
  };

  // Обработчик завершения загрузки
  const handleModalLoaded = () => {
    setIsLoadingModal(false);
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
                      className="mx-2 reg-button"
                      onClick={() => handleOpenModal('register')}
                      disabled={isLoadingModal}>
                      {isLoadingModal && (
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"></span>
                      )}
                      <span className={isLoadingModal ? 'visually-hidden' : ''}>
                        Регистрация
                      </span>
                    </Button>
                    <Button
                      variant="primary"
                      className="ms-1 login-button"
                      onClick={() => handleOpenModal('login')}
                      disabled={isLoadingModal}>
                      {isLoadingModal && (
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"></span>
                      )}
                      <span className={isLoadingModal ? 'visually-hidden' : ''}>
                        Войти
                      </span>
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
        <AuthModalLoader
          isOpen={modalType !== null}
          onLoaded={handleModalLoaded}
          show={modalType !== null}
          onHide={() => setModalType(null)}
          formType={modalType}
          switchToOther={
            modalType === 'login'
              ? () => setModalType('register')
              : () => setModalType('login')
          }
          buttonText={modalType === 'login' ? 'Войти' : 'Зарегистрироваться'}
          switchText={
            modalType === 'login' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'
          }
        />
      )}

      {/* Модальное окно профиля */}
      {user && (
        <Suspense
          fallback={
            <span className="visually-hidden">Ожидайте, идёт загрузка...</span>
          }>
          <ProfileModal
            show={showProfileModal}
            onHide={handleCloseProfileModal}
          />
        </Suspense>
      )}
    </>
  );
}

export default NaviBar;
