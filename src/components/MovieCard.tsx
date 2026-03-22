import { Star, Heart, Play, Plus, Download, CheckCircle } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  onWatch: (movie: Movie) => void;
  onAddList: (movie: Movie) => void;
  myList: string[];
  onDownload?: (movie: Movie) => void;
}

const getLinkType = (url: string) => {
  if (url.includes("mega.nz")) return "mega";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "direct";
};

const getOpenUrl = (url: string): string => {
  return url.replace("mega.nz/embed/", "mega.nz/file/");
};

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onWatch,
  onAddList,
  myList,
  onDownload,
}) => {
  const inList = myList.includes(movie.id || "");
  const links = movie.downloadLinks || [];
  const singleUrl = movie.downloadUrl;
  const hasDownload = links.length > 0 || !!singleUrl;
  const downloadCount = links.length || (singleUrl ? 1 : 0);
  const hasMultiple = downloadCount > 1;

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasDownload) return;

    if (hasMultiple && onDownload) {
      onDownload(movie);
      return;
    }

    const url = links.length > 0 ? links[0].url : singleUrl!;
    window.open(getOpenUrl(url), "_blank", "noopener,noreferrer");
  };

  const getLinkLabel = () => {
    const url = links.length > 0 ? links[0].url : singleUrl || "";
    const type = getLinkType(url);
    if (hasMultiple) return `${downloadCount} Qualities`;
    if (type === "mega") return "MEGA";
    if (type === "youtube") return "YouTube";
    return "Download";
  };

  return (
    <div className="group relative flex-shrink-0 w-36 md:w-44 cursor-pointer select-none">
      {/* ── Poster ── */}
      <div
        className="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-900 shadow-xl shadow-black/60 ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-105 group-hover:ring-white/20 group-hover:shadow-2xl group-hover:shadow-black/80"
        onClick={() => onWatch(movie)}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x450/1a1a1a/444?text=No+Image";
          }}
        />

        {/* Gradient overlay always */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Hover overlay with centered play button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={24} fill="white" className="text-white ml-1" />
          </div>
        </div>

        {/* Type badge — top left */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider ${
              movie.type === "series"
                ? "bg-blue-600 text-white"
                : "bg-[#E50914] text-white"
            }`}
          >
            {movie.type === "series" ? "SERIES" : "MOVIE"}
          </span>
        </div>

        {/* Rating — bottom left */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-400">
            <Star size={9} fill="currentColor" /> {movie.rating}
          </span>
        </div>

        {/* Add to list — top right (always visible) */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddList(movie); }}
          className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-lg ${
            inList
              ? "bg-white text-[#E50914]"
              : "bg-black/60 text-white hover:bg-white hover:text-[#E50914] backdrop-blur-sm"
          }`}
          title={inList ? "Remove from list" : "Add to list"}
        >
          {inList ? <CheckCircle size={13} /> : <Plus size={13} />}
        </button>
      </div>

      {/* ── Info ── */}
      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-semibold truncate leading-tight">
          {movie.title}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-gray-500 text-[10px]">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Heart size={8} className="text-gray-600" />
            <Star size={8} className="text-yellow-400" fill="currentColor" />
            <span className="text-yellow-400 text-[10px] font-medium">{movie.rating}</span>
          </div>
        </div>

        {/* Genre pill */}
        <div className="flex flex-wrap gap-1 mt-1">
          {movie.genre.slice(0, 1).map((g) => (
            <span key={g} className="text-[9px] text-gray-500 bg-gray-800/60 px-1.5 py-0.5 rounded-full border border-gray-700/50">
              {g}
            </span>
          ))}
        </div>

        {/* ── Download button — always visible, clean design ── */}
        {hasDownload ? (
          <button
            onClick={handleDownloadClick}
            className="mt-2 flex items-center justify-center gap-1.5 w-full text-[10px] font-bold py-1.5 rounded-lg transition-all active:scale-95 bg-[#1a2e1a] hover:bg-[#1f3d1f] border border-green-800/60 hover:border-green-600 text-green-400 hover:text-green-300 shadow-sm"
          >
            <Download size={10} />
            {getLinkLabel()}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MovieCard;
