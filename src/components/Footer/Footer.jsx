import { Col, Container, Row } from "react-bootstrap";

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
        <Row className="d-flex flex-nowrap">
          <Col xs={6} sm={4} lg={3} xl={2} className="d-flex">
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
              <br></br>
              <a
                className="text-secondary link-offset-2"
                href="https://github.com/WskyMike/moviesgallery-pet-react"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </small>
          </Col>
          <Col
            xs={6}
            sm={8}
            lg={9}
            xl={10}
            className="d-flex justify-content-start"
          >
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
