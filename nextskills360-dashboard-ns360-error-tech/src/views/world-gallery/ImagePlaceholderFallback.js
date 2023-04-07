import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import ImagePlaceholder from 'ui-component/cards/Skeleton/ImagePlaceholder';

const defaultFallbackSrc = require('assets/images/image_placeholder.png');

export const ImagePlaceholderFallback = ({ src, fallbackSrc = defaultFallbackSrc, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleError = useCallback(() => {
        setError(true);
    }, []);

    return (
        <>
            {!loaded && !error && <ImagePlaceholder width={280} height={194} />}
            {error && (
                <img
                    src={fallbackSrc}
                    loading="lazy"
                    alt="image"
                    style={{
                        height: '194px',
                        width: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center'
                    }}
                    onLoad={() => setLoaded(true)}
                    onError={handleError}
                    {...props}
                />
            )}
            {!error && (
                <img
                    src={src}
                    loading="lazy"
                    style={{
                        height: loaded ? '194px' : 0,
                        width: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center'
                    }}
                    onLoad={() => setLoaded(true)}
                    onError={handleError}
                    {...props}
                />
            )}
        </>
    );
};

ImagePlaceholderFallback.propTypes = {
    src: PropTypes.string.isRequired,
    fallbackSrc: PropTypes.string,
    props: PropTypes.object
};
