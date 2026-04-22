'use server'

import { getLiveStreamStatus, listLiveStreams } from '@/lib/mux';
import { supabase } from '@/lib/supabase';

export async function syncStreamWithMux(settingsId: string, liveStreamId: string) {
  try {
    const muxStatus = await getLiveStreamStatus(liveStreamId);
    
    if (!muxStatus) {
      throw new Error('Could not fetch status from Mux. Check your ID.');
    }

    if (!muxStatus.playbackId) {
      throw new Error('Mux Live Stream found, but no Playback ID exists for it.');
    }

    const { error } = await supabase
      .from('stream_settings')
      .update({
        is_live: muxStatus.isLive,
        m3u8_url: `https://stream.mux.com/${muxStatus.playbackId}.m3u8`,
        mux_live_stream_id: liveStreamId
      })
      .eq('id', settingsId);

    if (error) throw error;

    return { success: true, status: muxStatus.status };
  } catch (error: any) {
    console.error('Error syncing with Mux:', error.message || error);
    return { success: false, error: error.message };
  }
}

export async function fetchAllMuxStreams() {
    return await listLiveStreams();
}
