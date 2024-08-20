import React from 'react';

const Footer = () => {
  return (
    <footer style={{ color: '#fff', padding: '2px', textAlign: 'center' }}>
      <p>© {new Date().getFullYear()} Ma Boîte à Rythmes. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;