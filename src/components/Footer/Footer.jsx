import { Col, Container, Row } from "react-bootstrap";

import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";

function Footer() {
  const { movieDetailsLoading, bookmarksLoading } = useLoading();
  const { authLoading } = useAuth();

  if (movieDetailsLoading || bookmarksLoading || authLoading) return null;

  return (
    <footer className="navbar-fixed-bottom">
      <Container
        fluid="xl"
        className="text-start mt-4 pb-2 fw-light fs-6 text-secondary"
      >
        <Row>
          <Col md={2}>
            <small>Михаил Соснин &copy; 2024</small>
          </Col>
          <Col md={10}>
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
