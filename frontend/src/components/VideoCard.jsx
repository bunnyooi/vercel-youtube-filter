import React from 'react';

export default function VideoCard({ video }) {
  return (
    <div className="bg-white p-2 rounded shadow">
      <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank">
        <img src={video.thumbnail} alt="" className="w-full" />
      </a>
      <div className="mt-2">
        <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" className="font-bold">{video.title}</a>
        <div>Channel: {video.channelTitle}</div>
        <div>Views: {video.views}</div>
        <div>Boost: {video.boost}%</div>
        <div>{video.monetized ? '💲' : '❌'}</div>
      </div>
    </div>
  );
}
