import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView';

export default function SkillBar({ title, percent, duration = 2000 }) {
  const [ref, inView] = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    const stepTime = Math.max(Math.floor(duration / percent), 1);
    const timer = setInterval(() => {
      setCount((current) => {
        if (current >= percent) {
          clearInterval(timer);
          return percent;
        }
        return current + 1;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, percent, duration]);

  return (
    <div className="default-skill-item col-lg-6 col-md-6 col-sm-12" ref={ref}>
      <div className="default-skill-title">{title}</div>
      <div className="default-skill-bar">
        <div className="default-bar-inner">
          <div className="default-bar progress-line" style={{ width: `${inView ? percent : 0}%` }}>
            <div className="default-skill-percentage" />
            <div className="default-count-box count-box">
              <span className="count-text">{count}</span>%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
