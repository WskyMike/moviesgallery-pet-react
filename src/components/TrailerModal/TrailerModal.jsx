import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './TrailerModal.css';

function TrailerModal({ videoKeys, show, handleClose }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dialogClassName="trailer-modal"
      contentClassName="bg-dark text-white border-0">
      <button
        type="button"
        className="btn-close btn-close-white trailer-close-btn"
        onClick={handleClose}
        aria-label="Close"
      />
      <Modal.Body className="p-0">
        {videoKeys.length === 0 ? (
          <div className="text-center p-5" style={{ height: '40vh' }}>
            <p className="mt-3">Для данного тайтла нет доступных трейлеров</p>
          </div>
        ) : (
          <div className="ratio ratio-16x9">
            {videoKeys.map((key) => (
              <iframe
                key={key}
                src={`https://www.youtube.com/embed/${key}`}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

TrailerModal.propTypes = {
  videoKeys: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default TrailerModal;
