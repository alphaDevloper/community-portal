/**
 * Extracts a displayable thumbnail URL.
 * If the input is a YouTube URL, returns the YouTube thumbnail image.
 * Otherwise returns the URL as-is (assuming it's a direct image URL).
 */
export function getThumbnailUrl(url: string): string {
  if (!url) return "/placeholder.png";

  // YouTube URL patterns
  const youtubeRegex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    // Use YouTube's high-quality thumbnail
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }

  // Not a YouTube URL — return as-is (direct image URL)
  return url;
}
