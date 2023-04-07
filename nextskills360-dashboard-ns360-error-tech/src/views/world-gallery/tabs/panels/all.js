import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAllPhotosAndVideos } from 'services/world-gallery';
import { gridSpacing } from 'store/constant';
import { getCurrentUser } from 'store/selectors';
import MediaCard from '../../media-card';
import { TabPanel } from '../TabPanel';
import { usePagination } from 'use-pagination-firestore';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useRef, useState } from 'react';

export const AllTabPanel = ({ index, value, projectId, projectsList }) => {
    const [data, setData] = useState(new Map());
    const user = useSelector(getCurrentUser);

    const { items, isEnd, getNext } = usePagination(getAllPhotosAndVideos(projectId, user.dashboard_role, projectsList), {
        limit: 15
    });

    const cachedItemsRef = useRef(items);

    useEffect(() => {
        // only update data if items reference has changed
        if (items !== cachedItemsRef.current) {
            let mediaItems = new Map();
            items.forEach((item) => {
                mediaItems.set(item.id, item);
            });
            setData((prev) => new Map([...prev, ...mediaItems]));
            cachedItemsRef.current = items;
        }
    }, [items]);

    useEffect(() => {
        setData(new Map());
    }, [projectId]);

    const dataArray = Array.from(data.values());

    return (
        <TabPanel value={value} index={index}>
            <InfiniteScroll
                style={{ overflow: 'visible' }}
                dataLength={dataArray.length}
                next={getNext}
                hasMore={!isEnd}
                loader={
                    <p style={{ textAlign: 'center' }}>
                        <b>Loading...</b>
                    </p>
                }
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b> {dataArray.length === 0 ? 'No images and videos found' : 'Yay! You have seen it all'}</b>
                    </p>
                }
            >
                <Grid container justifyContent="center" sx={{ mt: 1.25, mb: 1.25 }} spacing={gridSpacing}>
                    {dataArray.map((item) => (
                        <Grid item key={item?.id}>
                            <MediaCard
                                isImage={item.file_type === 'images'}
                                src={item.download_url}
                                // isLoading={isLoading}
                                uid={item?.id}
                                status={item?.status}
                                totalLikes={item.total_likes}
                                isLiked={item?.liked_by?.includes(user?.user_uid)}
                                userUID={user?.user_uid}
                                userName={user?.user_name}
                                totalComments={item?.total_comments}
                                postedAt={item?.upload_time}
                                postedBy={item?.user_name}
                            />
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </TabPanel>
    );
};

AllTabPanel.propTypes = {
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    projectId: PropTypes.string.isRequired,
    projectsList: PropTypes.array.isRequired
};
