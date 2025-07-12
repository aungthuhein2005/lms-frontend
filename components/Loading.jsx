import { Spinner } from 'react-bootstrap';

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <Spinner animation="border" role="status" variant="primary" />
    <span className="ms-2 fw-semibold">Loading academic years...</span>
  </div>
);
export default Loading;