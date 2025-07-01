import React, { useState } from 'react';

export default function FilterForm({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [minViews, setMinViews] = useState(0);
  const [maxViews, setMaxViews] = useState(100000000);
  const [minSubs, setMinSubs] = useState(0);
  const [maxSubs, setMaxSubs] = useState(100000000);
  const [minLength, setMinLength] = useState(0);
  const [maxLength, setMaxLength] = useState(60);
  const [country, setCountry] = useState('US');
  const [uploadDate, setUploadDate] = useState('7d');

  const submit = e => {
    e.preventDefault();
    onSearch({ keyword, minViews, maxViews, minSubs, maxSubs, minLength, maxLength, country, uploadDate });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-2">
      <input placeholder="Keyword" value={keyword} onChange={e => setKeyword(e.target.value)} className="border p-2" />
      <select value={uploadDate} onChange={e => setUploadDate(e.target.value)} className="border p-2">
        <option value="24h">Last 24h</option>
        <option value="7d">7 days</option>
        <option value="30d">30 days</option>
        <option value="60d">60 days</option>
      </select>
      <button type="submit" className="bg-primary text-white p-2 col-span-2">Find Videos</button>
    </form>
  );
}
