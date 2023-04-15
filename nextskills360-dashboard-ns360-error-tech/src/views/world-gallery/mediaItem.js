// Importing required libraries
import PropTypes from 'prop-types';
import { useState, useCallback, memo, useMemo, useRef } from 'react';
import { Grid } from '@mui/material';
import { ImagePlaceholderFallback } from './ImagePlaceholderFallback';
import { debounce } from 'lodash';

// CSS styling for Grid Item
const gridItemStyles = {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center'
};

// Define MediaItem component which takes isImage and src props
const MediaItem = ({ isImage, src }) => {
    // useRef to references previous video
    const videoRef = useRef(null);
    // function to Stop all other videos if current video is being played.
    const handlePlay = () => {
        // Pause any other videos
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach((video) => {
            if (video !== videoRef.current) {
                video.pause();
            }
        });

        // Play current video
        videoRef.current.play();
    };

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item sx={isImage ? {} : gridItemStyles}>
                {isImage ? (
                    <ImagePlaceholderFallback src={src} />
                ) : (
                    // Otherwise, render video element with source passed through props
                    <video
                        // Add reference to video tag
                        ref={videoRef}
                        controlsList="nodownload"
                        style={{
                            height: '194px',
                            width: '100%',
                            objectFit: 'contain',
                            backgroundColor: 'black'
                        }}
                        onPlay={handlePlay}
                    >
                        <source src={src} />
                    </video>
                )}
            </Grid>
        </Grid>
    );
};

// Assign component name and proptypes to MediaItem component
MediaItem.displayName = 'MediaItem';
MediaItem.propTypes = {
    isImage: PropTypes.bool,
    src: PropTypes.string
};

export default memo(MediaItem);
