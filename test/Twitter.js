const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tiwtter", async () => {
  let twitter;
  let deployer, user1, user2, users;
  const tweetContent = "tweet";
  beforeEach(async () => {
    //Get signers from development accounts
    [deployer, user1, user2, users] = await ethers.getSigners();
    //Get the contract factory to deploy the contract
    const twitterFactory = await ethers.getContractFactory("Twitter");
    //Deploy contract
    twitter = await twitterFactory.deploy();
  });

  describe("Deployment", async () => {
    it("Tweet count should be 0", async () => {
      expect(await twitter.tweetCount()).to.equal(0);
    });

    const postCount = await decentratwitter.postCount();
    expect(postCount).to.equal(1);
  });

  describe("Create tweet", async () => {
    it("Should allow user to create tweets", async () => {});
    it("Should allow multiple users to create tweets", async () => {});
  });

  describe("Delete tweet", async () => {
    let tweetId;
    let author;

    beforeEach(async () => {
      author = user1;
      await twitter.connect(author).createTweet(tweetContent);
      tweetId = await twitter.tweetCount();
    });

    it("Should allow the author", async () => {});

    it("Should not delete invalid tweets", async () => {
      await expect(twitter.connect(author).deleteTweet(10)).to.be.revertedWith(
        "Tweet not found",
      );
    });

    it("Should not allow other users to delete the tweet", async () => {
      await expect(
        twitter.connect(user2).deleteTweet(tweetId),
      ).to.be.revertedWith("Must be the author");
    });
  });

  describe("Update tweet", async () => {
    let tweetId;
    let author;
    let newTweetContent;

    beforeEach(async () => {
      author = user1;
      await twitter.connect(author).createTweet(tweetContent);
      tweetId = await twitter.tweetCount();
    });

    it("Should allow the author to update tweet", async () => {
      //user1 creates a tweet
      await twitter.connect(author).updateTweet(tweetId, tweetContent);
      const tweet = await twitter.tweets(tweetId);
      expect(tweet.status).to.equal(1);
    });

    it("Should not update invalid tweets", async () => {
      await expect(twitter.connect(author).deleteTweet(10)).to.be.revertedWith(
        "Tweet not found",
      );
    });

    it("Should noth allow other users to update tweets", async () => {
      await expect(
        twitter.connect(user2).updateTweet(tweetId, tweetContent),
      ).to.be.revertedWith("Must be the author");
    });
  });

  describe("Getter functions", async () => {
    it("getTweets should fetch all undeleted the posts", async function () {});
  });
});
