const Icon = ({ name }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    banner: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4.5 17 4.8-4.8 3.4 3.2 2.4-2.2 4.4 3.8" /></>,
    video: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m10 9 5 3-5 3V9Z" /></>,
    gallery: <><rect x="3" y="5" width="16" height="14" rx="2" /><path d="m5 16 4-4 3 3 2-2 3 3" /><circle cx="8" cy="9" r="1" /><path d="M7 5V3h14v14h-2" /></>,
    offer: <><path d="M4 5h10l6 6-9 9-7-7V5Z" /><circle cx="9" cy="10" r="1.5" /></>,
    arrival: <><path d="M12 3v18M5 10l7-7 7 7M5 17h14" /><path d="M8 21h8" /></>,
    category: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></>,
    blog: <><path d="M5 3h11l3 3v15H5V3Z" /><path d="M16 3v4h4M8 11h8M8 15h8M8 19h5" /></>,
    testimonial: <><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="m8 11 1.2 1.2L12 9.5M14.5 10h3M14.5 13h2" /></>,
    logout: <><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M18 12H9" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    edit: <><path d="m14 5 5 5M4 20l3.5-.7L19 7.8a2.1 2.1 0 0 0-3-3L4.7 16.2 4 20Z" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    save: <><path d="M5 4h12l2 2v14H5V4Z" /><path d="M8 4v6h8V4M8 20v-6h8v6" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="3" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m5 8 7 5 7-5" /></>,
    eye: <><path d="M3 12s3.5-5.5 9-5.5S21 12 21 12s-3.5 5.5-9 5.5S3 12 3 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5.6 9 5.6a15.3 15.3 0 0 1-2.1 2.6M6.6 6.7C4.4 8.1 3 10.4 3 10.4S6.5 16 12 16c1 0 2-.2 2.8-.5" /></>,
    product: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h10" /></>,
    footer: <><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M6 6v8M18 6v8M12 6v8" /></>,
  }

  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export default Icon
