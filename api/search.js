import fetch from 'node-fetch';

export default async function handler(req, res) {
  const {
    keyword,
    minViews,
    maxViews,
    minSubs,
    maxSubs,
    minLength,
    maxLength,
    country,
    uploadDate
  } = req.query;

  const apiKey = process.env.YOUTUBE_API_KEY;
  let publishedAfter;
  if (uploadDate === '24h') publishedAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  else if (uploadDate === '7d') publishedAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  else if (uploadDate === '30d') publishedAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  else if (uploadDate === '60d') publishedAfter = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(keyword)}&regionCode=${country}&key=${apiKey}${publishedAfter ? `&publishedAfter=${publishedAfter}` : ''}`);
    const searchData = await searchRes.json();

    const videoIds = searchData.items.map(i => i.id.videoId).join(',');

    const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${apiKey}`);
    const detailsData = await detailsRes.json();

    const results = detailsData.items
      .filter(video => {
        const views = parseInt(video.statistics.viewCount, 10);
        const lengthSec = parseISO8601Duration(video.contentDetails.duration);
        return views >= minViews && views <= maxViews && lengthSec / 60 >= minLength && lengthSec / 60 <= maxLength;
      })
      .map(video => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        channelTitle: video.snippet.channelTitle,
        views: video.statistics.viewCount,
        duration: video.contentDetails.duration,
        boost: Math.floor(Math.random() * 100), // dummy boost until you add channel stats
        monetized: true // dummy flag; you can compute real later
      }));

    res.status(200).json({ videos: results });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}

function parseISO8601Duration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}
