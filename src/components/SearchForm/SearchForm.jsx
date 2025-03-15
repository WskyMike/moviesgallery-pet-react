import { Form, FormControl, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { FaSearch } from "react-icons/fa";

function SearchForm() {
  const { triggerSearch } = useSearch(); // в контекст
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    sessionStorage.setItem("searchQuery", searchQuery);
    triggerSearch(); // Триггер обновления в SearchResults
    navigate("/search");
    setSearchQuery("");
    setIsLoading(false);
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ищите фильмы и сериалы..."
            className="me-2 fw-light search-form__form-control"
            aria-label="Search"
            style={{ flexGrow: 1 }}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            type="submit"
            className="search-form__btn"
            disabled={isLoading}
          >
            <FaSearch />
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default SearchForm;
