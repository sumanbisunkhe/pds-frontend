export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getStats() {
  const response = await fetch(`${API_URL}/api/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export async function getRecentPhotos() {
  const response = await fetch(`${API_URL}/api/recent-photos`);
  if (!response.ok) throw new Error('Failed to fetch recent photos');
  return response.json();
}

export async function registerWeb(file: File, webId?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (webId) formData.append('web_id', webId);

  const response = await fetch(`${API_URL}/api/register-web`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to register');
  return response.json();
}

export async function getMyPhotos(webId: string) {
  const response = await fetch(`${API_URL}/api/my-photos?web_id=${webId}`);
  if (!response.ok) throw new Error('Failed to fetch your photos');
  return response.json();
}

export async function triggerProcessing() {
  const response = await fetch(`${API_URL}/process-photos`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to trigger processing');
  return response.json();
}

export async function getAboutDetails() {
  const response = await fetch(`${API_URL}/api/about`);
  if (!response.ok) throw new Error('Failed to fetch about details');
  return response.json();
}
