import axios, { type AxiosInstance } from "axios";
import RedisClient from "../db/redis/Redis.js";

export class FacebookReportsApi {
  private static readonly api: AxiosInstance = this.getHttpClient();
  private static readonly FACEBOOK_ACCESS_TOKEN: string =
    this.getOrganizationAccessToken("test");
  private static readonly CACHE_EXPIRY = 3600;

  private static getHttpClient(): AxiosInstance {
    const instance = axios.create({
      baseURL: "https://graph.facebook.com/v22.0/act_1083076062681667",
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        access_token: this.FACEBOOK_ACCESS_TOKEN,
      };
      return config;
    });

    return instance;
  }

  private static getOrganizationAccessToken(organizationName: string): string {
    switch (organizationName) {
      case "test":
        return process.env.FACEBOOK_ACCESS_TOKEN as string;
      default:
        return process.env.FACEBOOK_ACCESS_TOKEN as string;
    }
  }

  public static async getKpis(organisationName: string, datePreset: string) {
    try {
      const cacheKey = `${organisationName}:${datePreset}:kpis`;

      const cachedData = await RedisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await this.api.get(`/insights`, {
        params: {
          date_preset: datePreset,
          fields:
            "account_name,account_id,spend,impressions,clicks,cpc,ctr,actions,action_values,cost_per_action_type,purchase_roas,website_purchase_roas",
          level: "account",
        },
      });

      await RedisClient.set(
        cacheKey,
        JSON.stringify(response.data),
        this.CACHE_EXPIRY,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async getRecommendations() {
    try {
      const response = await this.api.get(`/recommendations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async getCampaigns(
    organizationName: string,
    datePreset: string,
  ) {
    try {
      const cacheKey = `${organizationName}:${datePreset}:campaigns`;

      const cachedData = await RedisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await this.api.get(`/insights`, {
        params: {
          date_preset: datePreset,
          fields:
            "campaign_name,actions,clicks{outbound_clicks,all_clicks},spend,purchase_roas,website_purchase_roas,action_values{add_to_cart}",
          level: "campaign",
          limit: 1000,
        },
      });

      await RedisClient.set(
        cacheKey,
        JSON.stringify(response.data),
        this.CACHE_EXPIRY,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async getGraphs(organizationName: string, datePreset: string) {
    try {
      const cacheKey = `${organizationName}:${datePreset}:graphs`;

      const cachedData = await RedisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await this.api.get(`/insights`, {
        params: {
          date_preset: datePreset,
          fields:
            "account_name,account_id,spend,impressions,clicks,cpc,ctr,actions,action_values,cost_per_action_type,purchase_roas,website_purchase_roas",
          level: "account",
          time_increment: 1,
          limit: 1000,
        },
      });

      await RedisClient.set(
        cacheKey,
        JSON.stringify(response.data),
        this.CACHE_EXPIRY,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async getAds(datePreset: string) {
    try {
      const response = await this.api.get(`/ads`, {
        params: {
          __cppo: 1,
          action_breakdowns: "action_type",
          fields:
            "id,creative{id},insights.date_preset(" +
            datePreset +
            "){impressions,clicks,spend,actions{action_type,value},action_values{action_type,value},purchase_roas{action_type,value}}",
          limit: 1000,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async fetchCreativeAsset(creativeId: string) {
    try {
      const response = await this.api.get(
        `https://graph.facebook.com/v22.0/${creativeId}`,
        {
          params: {
            debug: "all",
            origin_graph_explorer: 1,
            pretty: 0,
            suppress_http_code: 1,
            transport: "cors",
            thumbnail_height: 1350,
            thumbnail_width: 1080,
            __cppo: 1,
            format: "json",
            fields:
              "id,image_url,image_hash,creative_sourcing_spec,video_id,playable_asset_id,object_id,thumbnail_url,instagram_permalink_url,effective_instagram_media_id,instagram_actor_id,source_instagram_media_id,instagram_story_id,category_media_source,object_story_id,branded_content,dynamic_ad_voice,effective_instagram_story_id,effective_object_story_id",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async fetchIgMedia(mediaId: string) {
    try {
      const response = await this.api.get(
        `https://graph.facebook.com/v22.0/${mediaId}`,
        {
          params: {
            debug: "all",
            fields: "media_url,permalink,thumbnail_url,media_type",
            format: "json",
            method: "get",
            origin_graph_explorer: 1,
            pretty: 0,
            suppress_http_code: 1,
            transport: "cors",
            thumbnail_height: 1600,
            thumbnail_width: 1200,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static async fetchPost(postId: string) {
    try {
      const response = await this.api.get(
        `https://graph.facebook.com/v22.0/act_1083076062681667/ads`,
        {
          params: {
            fields:
              "id,name,adcreatives.limit(1){effective_object_story_id,name,thumbnail_url,authorization_category,instagram_permalink_url},preview_shareable_link",
            search: postId,
            limit: 1,
            thumbnail_height: 1080,
            thumbnail_width: 1080,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
