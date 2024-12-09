import { Col, Container, Row } from "react-bootstrap";
import { BiLogoGithub } from "react-icons/bi";

import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";

function Footer() {
  const { movieDetailsLoading, bookmarksLoading, mainPageLoading } =
    useLoading();
  const { authLoading } = useAuth();

  // Условие в зависимости от активного компонента
  const shouldHideFooter =
    (location.pathname === "/movie/:id" && movieDetailsLoading) ||
    (location.pathname === "/my" && bookmarksLoading) ||
    (location.pathname === "/" && mainPageLoading) ||
    authLoading;

  if (shouldHideFooter) return null;

  return (
    <footer className="navbar-fixed-bottom mx-0 mx-md-5 mt-4 mt-md-0">
      <Container
        fluid
        className="text-start mt-4 pb-2 fw-light fs-6 text-secondary"
      >
        <Row className="gap-sm-3 justify-content-start">
          <Col className="d-inline-flex" xs="auto">
            <small>
              <a
                className="text-secondary link-offset-2"
                href="https://mikewsky.tw1.ru/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Михаил Соснин
              </a>
              &nbsp;&copy; 2024
            </small>
          </Col>
          <Col className="d-inline-flex" xs="auto">
            <small>
              <a
                className="text-secondary link-offset-2"
                href="https://github.com/WskyMike/moviesgallery-pet-react"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <BiLogoGithub className="fs-5" />
              </a>
            </small>
          </Col>
          <Col className="d-inline-flex" xs={12} sm="auto">
            <small>
              Данныe API&nbsp;
              <a
                className="text-secondary link-offset-2"
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TMDB
              </a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
