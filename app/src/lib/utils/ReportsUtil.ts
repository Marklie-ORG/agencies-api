import { FacebookReportsApi } from "../apis/FacebookReportsApi.js";

export class ReportsUtil {
  public static async getAllReportData(datePreset: string) {
    const [bestAds, KPIs, campaigns, graphs] = await Promise.all([
      this.get10BestPerformingAds(datePreset),
      FacebookReportsApi.getKpis(datePreset),
      FacebookReportsApi.getCampaigns(datePreset),
      FacebookReportsApi.getGraphs(datePreset),
    ]);

    return { bestAds, KPIs, campaigns, graphs };
  }

  private static async get10BestPerformingAds(datePreset: string) {
    const data = await FacebookReportsApi.getAds(datePreset);
    const ads = data.data;

    return await this.processAds(ads);
  }

  private static getBest10AdsByRoas(ads: any[]): any[] {
    return ads
      .filter((ad) => ad.insights?.data?.[0]?.purchase_roas?.[0]?.value)
      .sort((a, b) => {
        const roasA = parseFloat(a.insights.data[0].purchase_roas[0].value);
        const roasB = parseFloat(b.insights.data[0].purchase_roas[0].value);
        return roasB - roasA;
      })
      .slice(0, 10);
  }

  private static async processAds(ads: any) {
    const shownAds = this.getBest10AdsByRoas(ads);

    const reportAds = shownAds.map((ad) => ({
      adCreativeId: ad.creative.id,
      thumbnailUrl: "",
      spend: ad.insights.data[0].spend,
      addToCart:
        ad.insights.data[0].actions?.find(
          (action: any) => action.action_type === "add_to_cart",
        )?.value || "0",
      purchases:
        ad.insights.data[0].actions?.find(
          (action: any) => action.action_type === "purchase",
        )?.value || "0",
      roas: ad.insights.data[0].purchase_roas[0].value || "0",
      sourceUrl: "",
    }));

    const creativeAssets = await Promise.all(
      shownAds.map(async (ad) => {
        const creativeId = ad.creative.id;
        return FacebookReportsApi.fetchCreativeAsset(creativeId);
      }),
    );

    await Promise.all(
      creativeAssets.map(async (creativeAsset, index) => {
        const { effective_instagram_media_id, effective_object_story_id } =
          creativeAsset;
        const reportAd = reportAds[index];

        if (effective_instagram_media_id) {
          const igMedia = await FacebookReportsApi.fetchIgMedia(
            effective_instagram_media_id,
          );
          reportAd.thumbnailUrl =
            igMedia.media_type === "IMAGE" && !igMedia.thumbnail_url
              ? igMedia.media_url
              : igMedia.thumbnail_url;
          reportAd.sourceUrl = igMedia.permalink;
        } else {
          const postId = effective_object_story_id.split("_")[1];
          const post = await FacebookReportsApi.fetchPost(postId);
          reportAd.thumbnailUrl =
            post.data[0].adcreatives.data[0].thumbnail_url;
          reportAd.sourceUrl = post.data[0].preview_shareable_link;
        }
      }),
    );

    return reportAds;
  }
}
