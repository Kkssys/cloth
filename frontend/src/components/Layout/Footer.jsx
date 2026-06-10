import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyles = {
    footer: {
      backgroundColor: '#261ad4',
      color: 'white',
      padding: '3rem 0 1.5rem',
      marginTop: '4rem',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    grid: {
      display: 'grid',
      gap: '2rem',
      marginBottom: '2rem',
    },
    title: {
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    links: {
      listStyle: 'none',
    },
    link: {
      color: '#9ca3af',
      textDecoration: 'none',
      marginBottom: '0.5rem',
      display: 'block',
    },
    socialLinks: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem',
    },
    socialIcon: {
      color: '#9ca3af',
      textDecoration: 'none',
      fontSize: '1.5rem',
      transition: 'color 0.3s',
    },
    bottom: {
      textAlign: 'center',
      paddingTop: '1.5rem',
      borderTop: '1px solid #2276d6',
      color: '#9ca3af',
    },
  };

  const socialMedia = [
    { name: 'Instagram', icon: <i className="bi bi-instagram"></i>, url: 'https://instagram.com', color: '#e4405f' },
    { name: 'Facebook', icon: <i className="bi bi-facebook"></i>, url: 'https://facebook.com', color: '#1877f2' },
    { name: 'WhatsApp', icon: <i className="bi bi-whatsapp"></i>, url: 'https://wa.me/1234567890', color: '#25D366' }
  ];

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        <div style={{ ...footerStyles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {/* About Us Section */}
          <div>
            <h3 style={footerStyles.title}>About Us</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Your one-stop shop for the latest fashion trends. Quality clothing at affordable prices.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 style={footerStyles.title}>Contact</h3>
            <ul style={footerStyles.links}>
              <li style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Email: support@fashionstore.com</li>
              <li style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Phone: +1 234 567 890</li>
              <li style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Address: 123 Fashion Street, NY</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 style={footerStyles.title}>Follow Us</h3>
            <div style={footerStyles.socialLinks}>
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={footerStyles.socialIcon}
                  onMouseEnter={(e) => e.currentTarget.style.color = social.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={footerStyles.bottom}>
          <p>&copy; 2024 FashionStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;