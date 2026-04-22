import Mux from '@mux/mux-node';

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const { video } = muxClient;

export const getLiveStreamStatus = async (liveStreamId: string) => {
  try {
    const liveStream = await video.liveStreams.retrieve(liveStreamId);
    console.log('Mux API Response for', liveStreamId, ':', JSON.stringify(liveStream, null, 2));
    
    // Find a public playback ID
    const playbackId = liveStream.playback_ids?.find(p => p.policy === 'public')?.id || liveStream.playback_ids?.[0]?.id;

    return {
      status: liveStream.status,
      isLive: liveStream.status === 'active',
      playbackId: playbackId,
    };
  } catch (error: any) {
    console.error('Error fetching Mux live stream:', error.message || error);
    return null;
  }
};

export const listLiveStreams = async () => {
    try {
        const liveStreams = await video.liveStreams.list();
        return liveStreams.data;
    } catch (error) {
        console.error('Error listing Mux live streams:', error);
        return [];
    }
}
