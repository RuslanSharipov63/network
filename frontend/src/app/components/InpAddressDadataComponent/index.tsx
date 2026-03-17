import { useState, useEffect, FC } from 'react';
import { BASE_URL } from '@/constant';

type InpAddressDadataComponentProps = {
    addAddress: (address: string) => void
}

const InpAddressDadataComponent:FC<InpAddressDadataComponentProps> = ({addAddress}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const res = await fetch(`${BASE_URL}/api/suggest_address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions.map((s: any) => s.value));
    };

    const timer = setTimeout(fetchSuggestions, 200); // debounce
    return () => clearTimeout(timer);
  }, [query]);


const sendAddress = (item: string) => {
setQuery(item)
addAddress(query)
}


  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите адрес"
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => sendAddress(s)} style={{cursor: "pointer"}}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InpAddressDadataComponent;