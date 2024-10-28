import { Col, Container, Row } from "react-bootstrap";

import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";

function Footer() {
  const { movieDetailsLoading, bookmarksLoading } = useLoading();
  const { authLoading } = useAuth();

  if (movieDetailsLoading || bookmarksLoading || authLoading) return null;

  return (
    <footer className="navbar-fixed-bottom mx-0 mx-md-5 mt-4 mt-md-0">
      <Container
        fluid
        className="text-start mt-4 pb-2 fw-light fs-6 text-secondary"
      >
        <Row className="d-flex justify-content-between flex-nowrap">
          <Col className="d-flex">
            <small>Михаил Соснин &copy; 2024</small>
          </Col>
          <Col className="d-flex justify-content-start">
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
