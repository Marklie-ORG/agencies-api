import Router from "koa-router";
import type { Context } from "koa";
// import { FacebookApi } from "lib/apis/FacebookApi.js";
import { FacebookApiUtil } from "lib/utils/FacebookApiUtil.js";

const root = {
	"data": [
		{
			"id": "2962000427377693",
			"name": "Vetsocial Agency",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_1523559864909939",
						"name": "Vetsocial",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmJjTWYyLVZAXMDlDYlNYRTRMYXpjTXp6bXluNmJlVWpNQ09xa2ptNll6SE5vUmltbzE3SVlncGJ0WGtneUM0Q2dlbUd6eHRVYzQ0MktWdmt4Ull3RlVB",
						"after": "QVFIUmJjTWYyLVZAXMDlDYlNYRTRMYXpjTXp6bXluNmJlVWpNQ09xa2ptNll6SE5vUmltbzE3SVlncGJ0WGtneUM0Q2dlbUd6eHRVYzQ0MktWdmt4Ull3RlVB"
					}
				}
			},
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_488864827865074",
						"name": "Schwartz & von Halen GLOBAL",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_358332790988699",
						"name": "Welvaere",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "America/Los_Angeles"
					},
					{
						"id": "act_527249171418045",
						"name": "Browney BV",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_807857433033195",
						"name": "Jewijers",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_523657478248751",
						"name": "Welvaere | Germany",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_932249560579409",
						"name": "Leatherglovesonline.com",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "America/New_York"
					},
					{
						"id": "act_2344814809147711",
						"name": "Fratelli Orsini GLOBAL",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "America/New_York"
					},
					{
						"id": "act_1389791497883743",
						"name": "Le Marais",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1009602899560824",
						"name": "Icetubs",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1241926396263951",
						"name": "DCFX Ad Account 2",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_741097623230292",
						"name": "DCFX Ad Account",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Australia/Brisbane"
					},
					{
						"id": "act_184132280559902",
						"name": "Welvaere | Belgium",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1189257468384809",
						"name": "Troonz ",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_669779088217919",
						"name": "Tafelmoda",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_571336068315404",
						"name": "Welvaere | France",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1066746727630819",
						"name": "Hang Eleven NL/EU",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1083076062681667",
						"name": "Airback ALL",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_638142818447959",
						"name": "Airback 2",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1122800945359409",
						"name": "90DC BV",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_382011124154026",
						"name": "Hang Eleven UK",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_650016737272023",
						"name": "Airback 3",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_241050668972359",
						"name": "90DC",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_633458938696037",
						"name": "Hang Eleven EU",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_176833222091787",
						"name": "Welvaere | Werkenbij",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_691976379783965",
						"name": "Airback IT",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjhxMjVmX1c2eHY4bEFuNHFMMk4zMUZADelZA4MzlxbENIbllyRWR1b1NRcEU1akFoZA0JxVlNTZAUpqbk9kYXhVWFlNY1RHZAXBNU1Q4eDhBdV9wYVdqbDV3",
						"after": "QVFIUmNzYXdPRGo4T1J6MDVjcWtrUlZAqUFRZASE5uMGd3ZA29PZAGxFRFZAvaWtObU81NWU0Y3lLM0ozNGtMYV9tN01FYVFlQ1RTZA3c5LUx1aVlkMWJyc1h4WC13"
					},
					"next": "https://graph.facebook.com/v22.0/2962000427377693/client_ad_accounts?access_token=EAASERizF7PoBO2vCjwuNTpGeFuXKIvNxzpPFJCfMll6FoYiNsZCZBjV8FO2RAeDNTHNQAt9FIft6Oi2BH3nZBlezpgYbCEtJ5hLnh5ihxLIlqDcCgQzSzke0fYA5PmqSCycRI6gf5R5yIZCwhP8NwfUBz5tC62uhbqWQeRxVW0EqxTZBocBlQuZBZA9&fields=id%2Cname%2Caccount_status%2Ccurrency%2Ctimezone_name&limit=25&after=QVFIUmNzYXdPRGo4T1J6MDVjcWtrUlZAqUFRZASE5uMGd3ZA29PZAGxFRFZAvaWtObU81NWU0Y3lLM0ozNGtMYV9tN01FYVFlQ1RTZA3c5LUx1aVlkMWJyc1h4WC13"
				}
			}
		},
		{
			"id": "2173853606276080",
			"name": "Z - Permanent Geblokt #2",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_869434560210129",
						"name": "Test test",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_675258969870420",
						"name": "M - Atelier des Femmes",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_292734461865908",
						"name": "M - The Good Roll",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_925542764564952",
						"name": "M - I.AM.caps",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_257569445535847",
						"name": "M - Not Your Baby",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1299585130246571",
						"name": "M - Beach Events",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_250858009554497",
						"name": "M - Beddenmaster",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_596190901276610",
						"name": "M - Prins Amsterdam",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_3782975518439928",
						"name": "M - Trendjuwelier.nl",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_314349202883797",
						"name": "M - Parapluwinkel.nl",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1094914680894719",
						"name": "M - Siebel Juweliers",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_533439764024863",
						"name": "M - XPLCT (Goed)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_707249210014655",
						"name": "M - Knaap BIkes",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_503740273631222",
						"name": "M - Spang",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_3429608440398890",
						"name": "M - Van Der Valk Tilburg",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_197060491392570",
						"name": "M - By Moïse",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_188994369032711",
						"name": "M - Lune Active",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_190542605384196",
						"name": "M - Fire Affair",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_842955676185586",
						"name": "M - Crisp Sheets",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_555874998536717",
						"name": "M - Schijf van Fief",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2237139923252018",
						"name": "M - New Again",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_422543358685774",
						"name": "M - AMAYA",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_941691609540128",
						"name": "M - Warrior Shoes",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2520319278003209",
						"name": "M - TGIF",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_447402736127296",
						"name": "M - Harlem82",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmc0MXpwYVlNSWEyU3dVV2xwM2pzQjUzZAXI4N0NVcHZAHUktScUtDQk9QNjM3cXpxaVgyRWp5enhLNmxKMTJfcnBNVmEwTVFlSEJkMWQ3THlnVldRQllR",
						"after": "QVFIUmJUU0J2TF9lcW9IU0NzNEJOSzBvZAGd2eGpnY3BuazA3Ym53NEdCLXFrTEJvZAnl6bU1zc19DOWxOR1pBWFk4MEdzNGU4WFdOSzBhMENJQy1ldG45N2ZAn"
					},
					"next": "https://graph.facebook.com/v22.0/2173853606276080/owned_ad_accounts?access_token=EAASERizF7PoBO2vCjwuNTpGeFuXKIvNxzpPFJCfMll6FoYiNsZCZBjV8FO2RAeDNTHNQAt9FIft6Oi2BH3nZBlezpgYbCEtJ5hLnh5ihxLIlqDcCgQzSzke0fYA5PmqSCycRI6gf5R5yIZCwhP8NwfUBz5tC62uhbqWQeRxVW0EqxTZBocBlQuZBZA9&fields=id%2Cname%2Caccount_status%2Ccurrency%2Ctimezone_name&limit=25&after=QVFIUmJUU0J2TF9lcW9IU0NzNEJOSzBvZAGd2eGpnY3BuazA3Ym53NEdCLXFrTEJvZAnl6bU1zc19DOWxOR1pBWFk4MEdzNGU4WFdOSzBhMENJQy1ldG45N2ZAn"
				}
			},
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_172594753",
						"name": "Trendjuwelier",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_173648139412313",
						"name": "webshop@isla-ibiza.nl",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "America/Los_Angeles"
					},
					{
						"id": "act_10150761770053296",
						"name": "Tip de Bruin - Advertentieaccount",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_194629567656317",
						"name": "Nølson",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_805787812936069",
						"name": "The Good Roll",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_628554007498138",
						"name": "Arma Security Operations",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Paris"
					},
					{
						"id": "act_471684687075969",
						"name": "Ad account 1 Harlem82",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_318472189303349",
						"name": "M - Residence & Carros",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_348605349514614",
						"name": "M - CarlieV Jewelry (Goed)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_363788564813701",
						"name": "Socialytix x LA Sisters (backup)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_3585378331474582",
						"name": "Socialytix x Knaap (backup)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_344463920033598",
						"name": "M - Be Pure Dutch & Amaya",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUml0WmVNc1VrVEJNcEpNNkEycS1rTWpYRG9kWTdLOFRwZAkFlWHVvUWlUN2lNRGtwSXU1TFZAvMGtLMVY3Q3RBWGVhbG81bnd3b0NfemJ3ZAmkyNFlBNExn",
						"after": "QVFIUkNWcFA0MkFGdVdTejFQb0JCaVdqaGdENWxMWW5MT0VsZAzI1U2ZAuQnlyUGtoQjd5alVEMnBpdDMzTzNPN1hLaC0tbXhOU1pCZAmVBM3FqMkFodHVnNXhR"
					}
				}
			}
		},
		{
			"id": "1950396001703283",
			"name": "Browney",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_1122800945359409",
						"name": "90DC BV",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_241050668972359",
						"name": "90DC",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_272012680790826",
						"name": "Browney",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_527249171418045",
						"name": "Browney BV",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUlktMjV5OVBxQXlaS0t6TDYySmt6SWNGN04wclMyd28wYThMWXFfZAmYzdWdNRzZAkOGxBZAGxsWXFKUm42d3hzYTlLS09xVHczWnFRd0pqZAzVKVGE5REFR",
						"after": "QVFIUngxREowcGdzZA0lMSnVqZA2JqRlZANZADNrV2FJQ1RObkJqdUhKcDFNSzFxWEFJYV9aX2luNXUtUExvMERlYXJKQnY5OUx3MUR5VlAzUlR5R2V1aThvX2RR"
					}
				}
			}
		},
		{
			"id": "1826712480916906",
			"name": "Welvaere B.V.",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_944264010376239",
						"name": "Welvaere | Europe",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_176833222091787",
						"name": "Welvaere | Werkenbij",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_571336068315404",
						"name": "Welvaere | France",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_184132280559902",
						"name": "Welvaere | Belgium",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1009602899560824",
						"name": "Icetubs",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_523657478248751",
						"name": "Welvaere | Germany",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_358332790988699",
						"name": "Welvaere",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "America/Los_Angeles"
					},
					{
						"id": "act_2036904026564416",
						"name": "Welvaere Pixel",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUk8yOUxIXzJuTVF1ZAlUtM3B6eTNXb040R0d0d2F4bFNmQjhzdnRrVTZAmZAE5qY1kwMzdab2U2Tl92RlQydFotNm1LQzdPUDZArbDJNTG1Tc01Fdl9nQzNR",
						"after": "QVFIUklySkxncUtQajdWLWtUUi1OdDBxR09SOExDeUxJQkEyVHpJb1VOekEzaHV3eVhpemtaeVhLeUlrRGVkN1BYUDFRdjNZAN3J6ZAkFKOWczckxvaWswOW1n"
					}
				}
			},
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_4783344931729600",
						"name": "Welvaere GmbH",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Berlin"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjFUN0dQc2xWeXJqWW5xV2xiNDBqc0NLNDA2NlZA5ajBjcDBQeU92b2t6TnhVd2x6NHVBSTVUZA2dyVVdraVhaeGNhODR1UFlDMEpDaUpxX2dOU2tlVWF3",
						"after": "QVFIUjFUN0dQc2xWeXJqWW5xV2xiNDBqc0NLNDA2NlZA5ajBjcDBQeU92b2t6TnhVd2x6NHVBSTVUZA2dyVVdraVhaeGNhODR1UFlDMEpDaUpxX2dOU2tlVWF3"
					}
				}
			}
		},
		{
			"id": "1713050146210222",
			"name": "The Trading Academy",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_926734668993560",
						"name": "TTA Capital",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUkZAldWZA1VUY5T0J0NUhoNk45ckZAEZATlaUDlDenFGVHRyc2FJWG9DbEZA0MnFoZAXVSaXNQWWgza1gyZA1RPY3JIUDZAyaTE5OUtWbjRIX29wTkxhemlZAUDR3",
						"after": "QVFIUkZAldWZA1VUY5T0J0NUhoNk45ckZAEZATlaUDlDenFGVHRyc2FJWG9DbEZA0MnFoZAXVSaXNQWWgza1gyZA1RPY3JIUDZAyaTE5OUtWbjRIX29wTkxhemlZAUDR3"
					}
				}
			}
		},
		{
			"id": "1605385867059087",
			"name": "Forex Fundamentals",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_1237787860866260",
						"name": "Forex Fundamentals",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmZAuMVNGSkJFdmV6aS00d2pjX0s3RnhzenRTX2dLX3BmQ1hTN0pXWkgwMkRCanVZAc1p6MUx6TUN3WVF0MTEtaVZAyUWZAiRHNWVlhESDV0UDBGQUpfdVh3",
						"after": "QVFIUmZAuMVNGSkJFdmV6aS00d2pjX0s3RnhzenRTX2dLX3BmQ1hTN0pXWkgwMkRCanVZAc1p6MUx6TUN3WVF0MTEtaVZAyUWZAiRHNWVlhESDV0UDBGQUpfdVh3"
					}
				}
			}
		},
		{
			"id": "1423279967816759",
			"name": "Trendjuwelier",
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_172594753",
						"name": "Trendjuwelier",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_3782975518439928",
						"name": "M - Trendjuwelier.nl",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_826508834752549",
						"name": "Socialytix x Trendjuwelier (backup)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmN6blFoQTRBNmxSdjZAEQ3BueW83Y0E0UHNZAMFh0VGQyRUlEUkJIYm9KVGVOSUVSUzYwRzF1VEVSd1VDN3NPRE0yZAzlRcUNKdU1RSlRfUms5RFZAoNUNB",
						"after": "QVFIUk5uU2kyREVYaVIxcy1Rc3ZAVRzZAFNXZAfUUZA4NTVpY3BhaU9yNy1zVU5GWGVmT25tbHhYS3o0aVBEeHJ3TUZAwekN1WXU4TmZApWE5ZANzJEZA1N2VUFOOXJn"
					}
				}
			}
		},
		{
			"id": "1363049233795964",
			"name": "John Weatherby Photography",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_618759028722919",
						"name": "Weatherby Photography",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "EST"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUm9kdVRLM3RIR1RqRm91LVFFRElFYXJhdFU4V2gzMElTS24xN1cxbTFoM1U4LWtsZAGdLeERwTlFRUVdKVDJqVHdFODNZAd2ZAPUFB3UDJTdExYQzViNTRn",
						"after": "QVFIUm9kdVRLM3RIR1RqRm91LVFFRElFYXJhdFU4V2gzMElTS24xN1cxbTFoM1U4LWtsZAGdLeERwTlFRUVdKVDJqVHdFODNZAd2ZAPUFB3UDJTdExYQzViNTRn"
					}
				}
			}
		},
		{
			"id": "1173270500301846",
			"name": "AISignals",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_2961494474017593",
						"name": "AI Signals",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjVKMERxT0tacjhGNEJDS3M3UWZA6Qmx5ZA1hLSGUydEZAWbkJNamZAuWS1IU3FqX1dwTE5oc2Y4YVFDekJxSVFCVXJXMDBTYS04UUFrak5zUkdBa2JwaUJB",
						"after": "QVFIUjVKMERxT0tacjhGNEJDS3M3UWZA6Qmx5ZA1hLSGUydEZAWbkJNamZAuWS1IU3FqX1dwTE5oc2Y4YVFDekJxSVFCVXJXMDBTYS04UUFrak5zUkdBa2JwaUJB"
					}
				}
			}
		},
		{
			"id": "1023341062205448",
			"name": "Airback",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_763581545182056",
						"name": "Airback DE/FR",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_691976379783965",
						"name": "Airback IT",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_650016737272023",
						"name": "Airback 3",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_638142818447959",
						"name": "Airback 2",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1083076062681667",
						"name": "Airback ALL",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUkFXd1hLVERTZA0g2RFBVQTFuR2RrVFRDZAV9mSDV6cGdIdG5aVEl4UnF1R1BJLXpSQXE4ZA0ZAkdF9jclVnaE9ndmNmNUQ4YUhyNTRodno2VzlHTnpGUlJR",
						"after": "QVFIUmxoZAFN0STZAtNENOOVY2QWQ1S0lFb0E4T0dVSUJ6U1FWMmo0a0J4a3QtbWpvQlpSUDExeGxnazRKMjN2SzNMclVVaWljODRxRER0alUyUmNwS3R3bFNB"
					}
				}
			},
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_657153241455529",
						"name": "Mind for Business",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2495006697415266",
						"name": "Breekpot",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2960841547366738",
						"name": "Olijfolie & Honing",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_187458025797204",
						"name": "Daily inspired 1",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1445294292320327",
						"name": "Dexter's",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_268384034292058",
						"name": "Stricto",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "America/Los_Angeles"
					},
					{
						"id": "act_675986256641883",
						"name": "backup",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_473653241164702",
						"name": "ashrose",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1607768822925143",
						"name": "The Basky Company",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_460359692561752",
						"name": "Lolke Jan Pilat",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_579972897151626",
						"name": "By John",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUi1sSldFc3lHbGpxNTNPQ2g0bldMd3J1UGVsazFHUlBqYnZA2WjRIWHJTaHNrS1lQall0RkgtOE5Qa3g4eFNRS3hOeEVzcXNVcklHenROWlVoUklCYWF3",
						"after": "QVFIUmJxWEx1dHhub04ycks0SXBXZAHdmd2c2YkNXNlJTREo0QzB4djJyYkpROG5IS1J5aW11WDNWcU9Ub19CckdndHFoM2JZAbXZAvRTR1Nk4xOGVJWmJMeU5R"
					}
				}
			}
		},
		{
			"id": "994917297517846",
			"name": "TTA-Capital",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_939180116791726",
						"name": "TTA Capital Ad account",
						"account_status": 2,
						"currency": "USD",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUnhLeFM3S0JCQ1Robk9ZATmF0MmZAfbmR1a0d5V0lSR2JrVXNXRjVDaTV1YUk3ZAm5RTjRqU1dJelF5UzlqUTg1QW1LSUVmUmdVb2NLZA0ZA5d2RId2l0YmJB",
						"after": "QVFIUnhLeFM3S0JCQ1Robk9ZATmF0MmZAfbmR1a0d5V0lSR2JrVXNXRjVDaTV1YUk3ZAm5RTjRqU1dJelF5UzlqUTg1QW1LSUVmUmdVb2NLZA0ZA5d2RId2l0YmJB"
					}
				}
			}
		},
		{
			"id": "937834684548854",
			"name": "Tubclub",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_1146229659988982",
						"name": "Loungetub",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2373748509635380",
						"name": "Woodtub",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmloQTNrZAXNLM2ZAOVHZAMWHRCLTFfYV9USTJfZAzgyNzRRUWl5Y3VsRjc0VWpBM2E5d19QVFpVVzY5dzVtNXAzeHVxemIwLVNNM2ZAIcnJNRWlZAMVpPY0NB",
						"after": "QVFIUnpKLVFPV0VCTWl5WnFuV3RCdDJubHhwZADJYeXVPQUU2Y05WTzVYcjF3OUF2dUhQNy1IWTBSQ2xsTnh3YlpWcUR0TlhMR3hRMHZAmMzBraXJGbS1mNjBR"
					}
				}
			}
		},
		{
			"id": "850991923793418",
			"name": "Emily Johnson",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_509155988183218",
						"name": "Ad account 1",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUklnOEZAETGVGTzJ4X2tKUEQxdDFydnoxY25LVWRYTVR1N2Y2c2FPVVgxUXd3eWRKYVM3WmhWWE1rY3lGZAWxvVU9YNXlnRTZAmVEhHTktnT2tVODMtMUhR",
						"after": "QVFIUklnOEZAETGVGTzJ4X2tKUEQxdDFydnoxY25LVWRYTVR1N2Y2c2FPVVgxUXd3eWRKYVM3WmhWWE1rY3lGZAWxvVU9YNXlnRTZAmVEhHTktnT2tVODMtMUhR"
					}
				}
			}
		},
		{
			"id": "746187052692279",
			"name": "Vetsocial Backup",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_237655214561261",
						"name": "Solutions Engineering Team - Advertentieaccount",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "America/Los_Angeles"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjd0SmxCNHBseng4aHVoRVBUaWpJUGJRRWNQZAW00RmlQWTNnUUdqWTBYZA1VMbjBpUzgtUERnUTJRY0ZASR1VOVWZAXN0NFdVhlSWZARSGsxUmVBWHY5OFV3",
						"after": "QVFIUjd0SmxCNHBseng4aHVoRVBUaWpJUGJRRWNQZAW00RmlQWTNnUUdqWTBYZA1VMbjBpUzgtUERnUTJRY0ZASR1VOVWZAXN0NFdVhlSWZARSGsxUmVBWHY5OFV3"
					}
				}
			},
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_2308517309369995",
						"name": "Toxozon",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjFyRzBObGNkbU0tRmkta1dnZA2N1UjQ2b2xIbXhqRlZAvWTlMMmZAHYW94R3BhUVB0bzNoN0l6QmhmSXoyQUplUmQyeHE4azE0b1R0SlZAGcFhxYmpVMEdn",
						"after": "QVFIUjFyRzBObGNkbU0tRmkta1dnZA2N1UjQ2b2xIbXhqRlZAvWTlMMmZAHYW94R3BhUVB0bzNoN0l6QmhmSXoyQUplUmQyeHE4azE0b1R0SlZAGcFhxYmpVMEdn"
					}
				}
			}
		},
		{
			"id": "736292333368414",
			"name": "Hang Eleven International",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_382011124154026",
						"name": "Hang Eleven UK",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_633458938696037",
						"name": "Hang Eleven EU",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_1066746727630819",
						"name": "Hang Eleven NL/EU",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_406537489855530",
						"name": "Hang Eleven (NIET ACTIEF)",
						"account_status": 101,
						"currency": "USD",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUm96djlhMnktdnpEWFhVckpLWHluT3FFN1luYXdjSW9IRmNpZAFB2OWhpdFBhdjdNWWs5d20zOVRxYThqSjVXNVpHZAGJQRlM4ZAVQ4cGh2QUttajFsejdn",
						"after": "QVFIUlVpZAmZAKS2JzbHFYOFMtdDZAmVVNkUkN4dWJvN2RrYy1HTDVyLVkxbGcwTW9HYnpWUDE2amRRNzF4cmRTM3BGWVBRX1lHTGd3Mk04ZA0xWeUN2ODVtVHlR"
					}
				}
			}
		},
		{
			"id": "664355784479728",
			"name": "bepure_dutch",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_928513531309722",
						"name": "Be Pure dutch",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "America/Los_Angeles"
					},
					{
						"id": "act_655359658687086",
						"name": "Amaya amsterdam",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "America/Los_Angeles"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUnFnVHU0UlZAhMlg5OWpJeUZAoWVhXV0ZAYZAzQ1bldyUWtZAaHd3aG0zUjljRVZAiZA0JVckVHcTBwd0pQa3B4eHJhdkhrNTlsTWJlckR4WnBmTnJNcUtZATnln",
						"after": "QVFIUm9DSHhmb0J5R3lwLWtPbExfU3FSeTNDLTFCN3Rlai1adVJtQWVBanhOM2M0YTdXV3p5OTdUOU5pN2E1bDF1aXRtSmp2dnA5dEEwRlEtLWNBY1ZAnVy1B"
					}
				}
			}
		},
		{
			"id": "435953850270702",
			"name": "Schwartz & von Halen Inc.",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_673235253654440",
						"name": "Fratelli Orsini Nederland",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2344814809147711",
						"name": "Fratelli Orsini GLOBAL",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "America/New_York"
					},
					{
						"id": "act_932249560579409",
						"name": "Leatherglovesonline.com",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "America/New_York"
					},
					{
						"id": "act_2112618638798670",
						"name": "LGO (OLD)",
						"account_status": 3,
						"currency": "USD",
						"timezone_name": "America/Los_Angeles"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjNldm1FTmJFc2N2T3B4dXQ3ZAi0xUXNCcVM2dk0talN2WkNGcEx6WVRVQUl6UUdPRkt1UWZAWczk5c2MtU09JZAjZADNGJzNVF4QlBlTVp2a3IwMTNGb1RR",
						"after": "QVFIUndUUTRqWWE1MDFBUk1YcXhrdktZAdUM0eG5FYkFIT0RmOWc3cE1Ya0hONkcwQUxqek9JX0NZAR2NucXZARMlB6TTE2bVNVR0ZAPd1A3NmtBRXUwQWVLZAlpR"
					}
				}
			}
		},
		{
			"id": "394712787544629",
			"name": "Prodos",
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_574077416332404",
						"name": "Financieel Fit",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_329862944594883",
						"name": "No Excess Advertentieaccount",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_420718780141613",
						"name": "Profipack",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_500524828583121",
						"name": "Gloow 1",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_167529343114406",
						"name": "167529343114406",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUnJlRmZAnUDB0bDJLMzdKeENqWnBiVmh6ZA2dzLXVXUjl5MXlWMmN6bU05TEwwcmpNY1pYNkVwZAXZANQk1ONTFpTmJZATEhBMlp3SG00U2FRWFJvcXpnUnln",
						"after": "QVFIUko3VktYcFlIdUJLeUxDMDFIZA2VKN3B0NTJMNkVjMTZAtSU9jeExjZA3hHMW5kMU0yZAUppMzlwQlUydmhmUGxDSndwWFpfZAlFRNUc0U04wZAm1QV0pqb2dB"
					}
				}
			}
		},
		{
			"id": "377170663805919",
			"name": "Studiomoda",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_669779088217919",
						"name": "Tafelmoda",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmE1dUpudk1ITFdXOEhHTkpTNENzQ0w4V2lEbjRuMDhES2JuQU9GZA1hYN2R5VUV4cXVLOUdmSGpSUDQxUURNMWFQUTdreUxwdG5JbVBMZA3ZAaTHB0M2t3",
						"after": "QVFIUmE1dUpudk1ITFdXOEhHTkpTNENzQ0w4V2lEbjRuMDhES2JuQU9GZA1hYN2R5VUV4cXVLOUdmSGpSUDQxUURNMWFQUTdreUxwdG5JbVBMZA3ZAaTHB0M2t3"
					}
				}
			}
		},
		{
			"id": "310809792089472",
			"name": "Sambrosa business portfolio",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_500514082644765",
						"name": "Sambrosa 3",
						"account_status": 2,
						"currency": "USD",
						"timezone_name": "America/Denver"
					},
					{
						"id": "act_1218443032562087",
						"name": "Sambrosa 2",
						"account_status": 1,
						"currency": "USD",
						"timezone_name": "America/Denver"
					},
					{
						"id": "act_838914251695174",
						"name": "Sambrosadream Ad Account",
						"account_status": 2,
						"currency": "USD",
						"timezone_name": "America/Los_Angeles"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUnhMWGV5V2ZALemc4bXFtQjNvSmNLOGZA1RDAwOFV0WGpyR1c1MzR1V1VnRWpCekhmZAWhYQTgwczQ1S3p4dEU0U0dLaTVjSG9OOWxsbDQ4MXdHeW93Y01B",
						"after": "QVFIUlBYd2FnNWptbEp6RjdYSEFZAVnpnSngtMGxBekhRdUtCVkN2clBNdzBCWGNxVTFwNVZApSlRfRmVJYU9TazE5blhiR01GWndnZAjl1LTdNMlVYRm9QVGx3"
					}
				}
			}
		},
		{
			"id": "266311128475135",
			"name": "Dreamchasers FX",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_1241926396263951",
						"name": "DCFX Ad Account 2",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_741097623230292",
						"name": "DCFX Ad Account",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Australia/Brisbane"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmRBOG84VlV5R1RubEJ6U1BXdmNlM0dOYWpBZAXFkdDA2TWlKcXROR0J0UWhyX2ZAPaEJFWDZAxMlpvQllBNDI0QURiSFRnMlRBZAVBWSnAta1hVdk1LZAzF3",
						"after": "QVFIUjdJQi1vQ3JyWHd6VXZAQWktaMFZApaXdvc2RFaEZAwTFhKTXdFelpCSG1CX0xHZAjlidXFsMEhwOVJ3dXVtbk03MUR1aFcwbnpQYWwtenNFX3hvNHpubm1R"
					}
				}
			}
		},
		{
			"id": "235427887875454",
			"name": "dailyoddsnl",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_1625758344274116",
						"name": "DailyOdds",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUjdUY3cwSmduaDNiVWhhMm1KOWc4SnBmTEVDR1dyLWZALWktkS0RMQTdBV3p1SG5MY09fQ0hPNkpwN3d4RXFtbFBkMzJONEd0ajduVnVmRU5sTS1HdGNR",
						"after": "QVFIUjdUY3cwSmduaDNiVWhhMm1KOWc4SnBmTEVDR1dyLWZALWktkS0RMQTdBV3p1SG5MY09fQ0hPNkpwN3d4RXFtbFBkMzJONEd0ajduVnVmRU5sTS1HdGNR"
					}
				}
			}
		},
		{
			"id": "203946360222294",
			"name": "Gadget Club",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_903711857988489",
						"name": "Gadget Club",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmNSTUtEV1dpRng0Rmc5YnZAvV3EyQmt2a05pbm5vd2ltUWU5Qkh0RkJEY29vM0VUS1BjV0pubDQ0ZAW4zYWY2MFZAUbi1IbVduQU1HVFhRQms1bWZAZAcEV3",
						"after": "QVFIUmNSTUtEV1dpRng0Rmc5YnZAvV3EyQmt2a05pbm5vd2ltUWU5Qkh0RkJEY29vM0VUS1BjV0pubDQ0ZAW4zYWY2MFZAUbi1IbVduQU1HVFhRQms1bWZAZAcEV3"
					}
				}
			}
		},
		{
			"id": "157729711607728",
			"name": "Schwartz & von Halen",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_287630702797144",
						"name": "SVH .EU",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_363211708244584",
						"name": "SVH France",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_636332280608644",
						"name": "SVH UK",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_483205948889309",
						"name": "SVH België",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_357234691626711",
						"name": "SVH Oostenrijk",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_2345563875732383",
						"name": "SVH Duitsland",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_488864827865074",
						"name": "Schwartz & von Halen GLOBAL",
						"account_status": 1,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUnFXR09ma3hNbExLc1EycVkxSDVsVGdWaDNVUUhsdTNFZA3NRWUxFMndwN1gwT3ZAXNTM2akl4Vl8tTnRUYzVjOFpuRXpTSHpnTzFxSVprUWtQMmJmT1VR",
						"after": "QVFIUm41aWFvWUdTc3VJRnR5SmJ2c3hjZA0hnYXQ4Nkg2NERLWmNsaXZA1X1NrVjF4djJUa191MVBTUXVORFEzdnBqenRWNVF5TlpLN2o3Y1R5TWoxeHFwTl93"
					}
				}
			}
		},
		{
			"id": "144898006676299",
			"name": "Z - Permanent Geblokt #3",
			"owned_ad_accounts": {
				"data": [
					{
						"id": "act_744881756381648",
						"name": "Parapluwinkel (Back 3.0)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_4082008051812565",
						"name": "Socialytix x I.AM.CAPS Backup (dec)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					},
					{
						"id": "act_826508834752549",
						"name": "Socialytix x Trendjuwelier (backup)",
						"account_status": 2,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUmgxOEl0bThkMWhXMTA0UkVrNmlHUVByOE0wemN0cWZApRmxQdVY3alJNQXNydnhNRDdSRDl2SEh6WGRrb2dCSW5ZAeEVUVWthQlZAxRmpWX1lmaGhINm1R",
						"after": "QVFIUmVLckE0TjFRZAkhKakQ4Q2tJLXZAVUXdXY2pPaGsyT3J6cER1RkZARZAzBFZAE1pajlwaTZAyR1BkcVpRMWNQVHotRzRUTnBjSmY5cUVSdFJnekNyS2huX2tR"
					}
				}
			},
			"client_ad_accounts": {
				"data": [
					{
						"id": "act_459850131665822",
						"name": "Mask QP Clothing | DV | Socialityx",
						"account_status": 101,
						"currency": "EUR",
						"timezone_name": "Europe/Amsterdam"
					}
				],
				"paging": {
					"cursors": {
						"before": "QVFIUnh2Ty16MzZAnU3FtZA0xmSy1oRUFvYklBeEFoSTFoSUJOZAXBrUDNmd0NlblJFZAGFldUN5TzZAsMXRwUVNnR3d3MkM3cUN0UjNCX0pHQXNqZAm1oY1p4bmZA3",
						"after": "QVFIUnh2Ty16MzZAnU3FtZA0xmSy1oRUFvYklBeEFoSTFoSUJOZAXBrUDNmd0NlblJFZAGFldUN5TzZAsMXRwUVNnR3d3MkM3cUN0UjNCX0pHQXNqZAm1oY1p4bmZA3"
					}
				}
			}
		}
	],
	"paging": {
		"cursors": {
			"before": "QVFIUnRrai1HWDRlbElJMl9UR2w1VUFldTBIVjhQU3ZALUHkyLVBxSHYtYzNrbzB1TlE3TDM3Q0lYcWd3U2UyUDBwa1VMSEozaTh5WU5QbHZAuR1JoQlpocG5R",
			"after": "QVFIUmdSa1EyWVh6dDd5QXI5Nm10YWFlRG12TFRaNW4tZA1pNVVV0ZAThPWTNCWU1ZAWGEzYTZAQb3RTRkpVYzNpUEFncURoeVQ0ZA0VORkJ3R1NfelJDVDRBQ213"
		},
		"next": "https://graph.facebook.com/v22.0/9665397933490694/businesses?fields=id,name,owned_ad_accounts%7Bid,name,account_status,currency,timezone_name%7D,client_ad_accounts%7Bid,name,account_status,currency,timezone_name%7D&access_token=EAASERizF7PoBO2vCjwuNTpGeFuXKIvNxzpPFJCfMll6FoYiNsZCZBjV8FO2RAeDNTHNQAt9FIft6Oi2BH3nZBlezpgYbCEtJ5hLnh5ihxLIlqDcCgQzSzke0fYA5PmqSCycRI6gf5R5yIZCwhP8NwfUBz5tC62uhbqWQeRxVW0EqxTZBocBlQuZBZA9&limit=25&after=QVFIUmdSa1EyWVh6dDd5QXI5Nm10YWFlRG12TFRaNW4tZA1pNVVV0ZAThPWTNCWU1ZAWGEzYTZAQb3RTRkpVYzNpUEFncURoeVQ0ZA0VORkJ3R1NfelJDVDRBQ213"
	}
}



export class AdAccountsController extends Router {
  constructor() {
    super({ prefix: "/api/ad-accounts" });
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.get("/businesses", this.getAdAccounts);
  }

  private async getAdAccounts(ctx: Context) {
    try {
        // const organizationName = ctx.query.organizationName as string;
        // const facebookApi = new FacebookApi(organizationName);
        // const response = await facebookApi.getBusinesses();

        const response = root;

        const hierarchy = FacebookApiUtil.extractAccountHierarchy(response);

        ctx.body = hierarchy;
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: "Internal server error",
            error: error,
        };
        ctx.status = 500;
    }
  }

    
}
