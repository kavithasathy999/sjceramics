import useScrollProgress from '../hooks/useScrollProgress';

export default function BackToTop() {
  const { progress, visible, scrollToTop } = useScrollProgress(300);

  // Same stroke-dash trick the original backtotop.js used, driven by React state.
  const circumference = 2 * Math.PI * 49;
  const offset = circumference * (1 - progress);

  return (
    <>
      <a
        href="https://wa.me/919944242685"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" />
      </a>
      <div
        className={`progress-wrap${visible ? ' active-progress' : ''}`}
        onClick={scrollToTop}
        role="button"
        tabIndex={0}
        aria-label="Back to top"
      >
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.1s linear',
            }}
          />
        </svg>
      </div>
    </>
  );
}
