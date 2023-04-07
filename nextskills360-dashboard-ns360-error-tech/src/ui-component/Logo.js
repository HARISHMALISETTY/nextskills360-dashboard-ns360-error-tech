import PropTypes from 'prop-types';

const Logo = ({ url }) => {
    return (
        <div
            style={{
                height: '80px',
                width: '200px',
                backgroundImage: `url(${url})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center center'
            }}
        ></div>
    );
};

Logo.propTypes = {
    url: PropTypes.string.isRequired
};

export default Logo;
