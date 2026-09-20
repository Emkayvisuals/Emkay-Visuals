/**
 * Video URL helper utilities for YouTube, Vimeo, and direct MP4/WebM video formats
 */

export function isMotionCategory(category: string | undefined | null): boolean {
  if (!category) return false;
  const normalized = category.trim().toLowerCase();
  return (
    normalized === 'motion graphics' ||
    normalized === 'motion' ||
    normalized === 'motion design' ||
    normalized === 'animation'
  );
}

export function getYoutubeVideoId(url: string | undefined | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function getYoutubeThumbnail(url: string | undefined | null): string | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYoutubeThumbnailFallback(url: string | undefined | null): string | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getVimeoVideoId(url: string | undefined | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  return match ? match[1] : null;
}

export function getVideoType(url: string | undefined | null): 'youtube' | 'vimeo' | 'mp4' | null {
  if (!url) return null;
  if (getYoutubeVideoId(url)) return 'youtube';
  if (getVimeoVideoId(url)) return 'vimeo';
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('blob:') || url.startsWith('data:video/')) {
    return 'mp4';
  }
  return null;
}

export function getEmbedVideoUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const ytId = getYoutubeVideoId(url);
  if (ytId) {
    return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
  }
  // If direct mp4 or already an embed URL
  if (url.includes('embed') || url.includes('player.vimeo.com')) {
    return url;
  }
  return url;
}

export function getEffectiveProjectImage(project: {
  image?: string;
  videoUrl?: string;
  category?: string;
}): string {
  if (project.image && project.image.trim()) {
    return project.image.trim();
  }
  if (isMotionCategory(project.category) && project.videoUrl) {
    const ytThumb = getYoutubeThumbnail(project.videoUrl);
    if (ytThumb) return ytThumb;
  }
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
}
