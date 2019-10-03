![Naao Banner](./logo/Feature.jpg)

Naao Mobile App
===============
Naao is a worldwide community platform that helps people hand deliver their packages to their loved ones anywhere in the world.

For travelers going on a trip, you can make some extra money by picking up a package from a sender near you within your city and dropping it off to someone where you're going to.

For anyone who wants to send a package to someone overseas, through Naao App, you can find a traveler near you or within your city who is traveling to where you want to send the package to.

## [Screenshots](./screenshots)

Downloads
====================

|Executable|Team|Description|Licence|Country|Author|
|------------------------------------------------------|---------|--------------------------------|-------|-------|----------------|
| [.apk](https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40foysalit/naao-6c2f884f45fa4f24a163d909c19fefb8-signed.apk) [.ipa](https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/ios/%40foysalit/naao-add11fc0-4601-4d1f-8f18-d3c2970aa032-archive.ipa) [PlayStore](https://play.google.com/store/apps/details?id=com.bdgeeks.naao) | BdGeeks | Deliver your package with a personal touch. | [GNU AGPLv3](LICENSE.md) | Italy | [@foysalit](https://github.com/foysalit) |

How It Works
============
We are working tirelessly to make naao a pleasing experience for each and every users so new features are being released, workflows are being reworked very often. However, at it's core, the following steps are what makes Naao work:

- After booking a trip, a traveler *X* signs up on Naao, posts their trip with details such as the departure-destination locations, what size and weight of parcel they can carry and delivery on their trip etc.

- Senders can search for travelers with a multitude of filters such as departure destination cities, available size, weight, pick up drop off dates etc. 

- To keep things secure, civil and private, Naao provides a very streamlined bid/offer system within the app. A sender can only make an offer to a traveler, requesting them to delivery their parcel, by stating their parcel size, weight and amount of offer (currency specific). Once the offer is sent, both parties can use Naao Chat to arrange pick up, drop off, transaction etc. 

- Travelers have the option to make a counter offer for each offer. Above all, travelers are at full liberty to accept/reject/negotiate an offer.

- Finally, once the parcel is delivered, traveler and sender can provide a star rating and review message describing their experience with each other to help future senders and travelers.

Development
===========
This is a standard react native app with expo. Follow expo's official doc to get it up and running. Couple things to make sure before you attempt to run the app on your machine:

- insert your `google maps api key` in the [app.json](./app.json) file 
- Point to the serverside meteor app in the [config.js](./config.js) file. You can find the meteor app in [this repo](https://github.com/foysalit/naao-meteor)

Credits
=======
Naao does not receive any kind of funding/corporate donation as of now and solely developed as a bootstrapped product.

- Designed by [@suborna00](https://twitter.com/suborna00)
- Developed by [@foysalit](https://twitter.com/foysalit)