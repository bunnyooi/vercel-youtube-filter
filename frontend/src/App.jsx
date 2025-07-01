import React, { useState } from 'react';
import FilterForm from './components/FilterForm';
import VideoCard from './components/VideoCard';
import Spinner from './components/Spinner';
import axios from 'axios';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const findVideos = async (filters) => {
    setLoading(true);
    const res = await axios.get('/api/search', { params: filters });
    setVideos(res.data.videos);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-primary mb-4">YouTube Filter</h1>
      <FilterForm onSearch={findVideos} />
      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}
