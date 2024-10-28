import { Form, FormControl, Button, Row, Col } from "react-bootstrap";

import { useEffect } from "react";

function SearchForm() {
  const handleSearch = (event) => {
    event.preventDefault();
    // Логика обработки поиска
    console.log("Поиск выполнен");
  };

  // Функция для проверки ширины экрана и добавления классов
  const handleResize = () => {
    const form = document.querySelector(".search-form__form-control");
    const button = document.querySelector(".search-form__btn");

    if (window.innerWidth >= 992) {
      form.classList.add("form-control-lg");
      button.classList.add("btn-lg");
    } else {
      form.classList.remove("form-control-lg");
      button.classList.remove("btn-lg");
    }
  };

  // Используем useEffect для обработки изменений размера экрана
  useEffect(() => {
    handleResize(); // Проверка при монтировании компонента
    window.addEventListener("resize", handleResize); // Добавляем слушатель

    // Очищаем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Row className="mx-0 mx-md-5">
      <Col>
        <Form className="d-flex gap-2 my-5" onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Поиск в разработке . . ."
            className="me-2 fw-light search-form__form-control"
            aria-label="Search"
            style={{ flexGrow: 1 }}
          />
          <Button variant="secondary" type="submit" className="search-form__btn">
            Искать
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default SearchForm;
