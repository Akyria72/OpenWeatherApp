import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <Input
        type="text"
        placeholder="Search for a city (e.g. London, Nicosia, Tokyo)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        aria-label="City name"
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
