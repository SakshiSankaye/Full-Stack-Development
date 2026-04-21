const Spinner = ({ fullscreen = false, size = 36 }) => (
  <div className={`spinner-wrap ${fullscreen ? "fullscreen" : ""}`}>
    <div
      className="spinner"
      style={{ width: size, height: size, borderWidth: size > 30 ? 3 : 2 }}
    />
  </div>
);

export default Spinner;
