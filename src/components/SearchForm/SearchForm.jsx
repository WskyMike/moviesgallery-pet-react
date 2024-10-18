import { Form, FormControl, Button, Row, Col } from "react-bootstrap";

function SearchForm() {
  const handleSearch = (event) => {
    event.preventDefault();
    // Логика обработки поиска
    console.log("Поиск выполнен");
  };

  return (
    <Row className="mx-5">
      <Col>
        <Form className="d-flex gap-2 my-5" onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Поиск пока в разработке..."
            className="form-control-lg me-2 fw-light"
            aria-label="Search"
            style={{ flexGrow: 1 }}
          />
          <Button variant="secondary" type="submit" className="btn-lg">
            Искать
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default SearchForm;
