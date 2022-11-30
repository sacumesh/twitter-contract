const chai = require("chai");
const { ethers } = require("hardhat");
const { expect } = chai;

describe("Twitter", async () => {
  let twitter;
  let user1, user2;
  beforeEach(async () => {
    //Get signers from development accounts
    [user1, user2] = await ethers.getSigners();
    //Get the contract factory to deploy the contract
    const twitterFactory = await ethers.getContractFactory("Twitter");
    //Contract deployment
    twitter = await twitterFactory.deploy();
  });

  describe("Deployment", async () => {
    it("Should start with tweet count equal 0", async () => {
      expect(await twitter.tweetCount()).to.equal(0);
    });
    it("Should return empty tweets array at start", async () => {
      expect(await twitter.getTweets()).to.be.an("array").that.is.empty;
    });
  });

  describe("Create tweet", async function () {
    let author, id, content;
    before(() => {
      author = user1;
      content = "hi";
      id = 1;
    });
    it("Should allow user to create tweets", async () => {
      await twitter.connect(author).createTweet(content);
      const tweet = await twitter.getTweet(id);
      expect(tweet.id).to.equal(id);
      expect(tweet.author).to.equal(author.address);
      expect(tweet.content).to.equal(content);
      expect(tweet.createdAt).to.be.above(0);
    });
    it("Should not allow user to create tweet if content is empty", async () => {
      await expect(twitter.connect(author).createTweet("")).to.be.revertedWith(
        "Tweet content is empty",
      );
    });

    it("Should not allow user to create tweet if content is long", async () => {
      content =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
        "Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam" +
        "nisl, eget aliquam nunc nisl eget nisl. Donec auctor, nisl eget" +
        "ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nunc nisl eget nisl." +
        "Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nunc nisl eget nisl";
      expect(content.length).to.be.above(280);
      await expect(
        twitter.connect(author).createTweet(content),
      ).to.be.revertedWith("Tweet content is too long");
    });
  });

  describe("Get tweet", async () => {
    let author, id, content;

    beforeEach(async () => {
      author = user1;
      content = "hi";
      id = 1;
      // author creates a tweet
      await twitter.connect(author).createTweet(content);
    });

    it("Should return the correct tweet", async () => {
      const tweet = await twitter.connect(author).getTweet(id);
      expect(tweet.id).to.equal(id);
      expect(tweet.content).to.equal(content);
    });

    it("Should not return tweet if tweet is deleted", async () => {
      await twitter.connect(author).deleteTweet(id);
      await expect(twitter.getTweet(1)).to.be.revertedWith("Tweet deleted");
    });

    it("Should not return tweet if tweet does not exist", async () => {
      //Invalid id can be any id that is not a key in the tweets mapping
      const invalId = 2;
      await expect(twitter.getTweet(invalId)).to.be.revertedWith(
        "Tweet not found",
      );
    });
  });

  describe("Delete tweet", async () => {
    let author, id, content, nonAuthor;

    beforeEach(async () => {
      author = user1;
      nonAuthor = user2;
      content = "hi";
      id = 1;

      // author creates a tweet
      await twitter.connect(author).createTweet(content);
    });

    it("Should allow author to delete tweet", async () => {
      await twitter.connect(author).deleteTweet(id);
      await expect(twitter.getTweet(id)).to.be.revertedWith("Tweet deleted");
    });

    it("Should not allow non-author to delete tweet", async () => {
      await expect(
        twitter.connect(nonAuthor).deleteTweet(id),
      ).to.be.revertedWith("Not authorized");
    });

    it("Should not allow to delete tweet if tweet does not exist", async () => {
      //Invalid id can be any id that is not a key in the tweets mapping
      const invalId = 2;
      await expect(twitter.deleteTweet(invalId)).to.be.revertedWith(
        "Tweet not found",
      );
    });
  });

  describe("Update tweet", async () => {
    let author, id, content, newContent, nonAuthor;

    beforeEach(async () => {
      author = user1;
      nonAuthor = user2;
      content = "hi";
      newContent = "hello";
      id = 1;
      //author creates tweet
      await twitter.connect(author).createTweet(content);
    });

    it("Should allow the author to update tweet", async () => {
      //author updates tweet with new content
      await twitter.connect(author).updateTweet(id, newContent);

      //author gets updated tweet
      const tweet = await twitter.getTweet(id);
      expect(tweet.updatedAt).to.be.above(0);
      expect(tweet.updatedAt).to.be.above(tweet.createdAt);
      expect(tweet.content).to.equal(newContent);
      expect(tweet.content).to.equal(newContent);
      expect(tweet.id).to.equal(id);
      expect(tweet.author).to.equal(author.address);
    });

    it("Should not allow non-author to update tweet", async () => {
      await expect(
        twitter.connect(nonAuthor).updateTweet(id, newContent),
      ).to.be.revertedWith("Not authorized");
    });

    it("Should not allow author to update tweet if content is empty", async () => {
      await expect(
        twitter.connect(author).updateTweet(id, ""),
      ).to.be.revertedWith("Tweet content is empty");
    });

    it("Should not allow user to update tweet if content is long", async () => {
      content =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
        "Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam" +
        "nisl, eget aliquam nunc nisl eget nisl. Donec auctor, nisl eget" +
        "ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nunc nisl eget nisl." +
        "Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nunc nisl eget nisl";
      expect(content.length).to.be.above(280);
      await expect(
        twitter.connect(author).updateTweet(id, content),
      ).to.be.revertedWith("Tweet content is too long");
    });

    it("Should not allow to update tweet if tweet is deleted", async () => {
      //author deletes tweet
      await twitter.connect(author).deleteTweet(id);

      await expect(
        twitter.connect(author).updateTweet(id, newContent),
      ).to.be.revertedWith("Tweet deleted");
    });

    it("Should not allow to update tweet if tweet does not exist", async () => {
      //Invalid id can be any id that is not a key in the tweets mapping
      const invalId = 2;
      await expect(
        twitter.connect(author).updateTweet(invalId, newContent),
      ).to.be.revertedWith("Tweet not found");
    });
  });
  describe("Get tweets", async () => {
    let author1, content1, id1;
    let author2, content2, id2;

    beforeEach(async () => {
      author1 = user1;
      author2 = user2;
      content1 = "hi";
      content2 = "hello";
      id1 = 1;
      id2 = 2;
      //author 1 creates tweet
      await twitter.connect(author1).createTweet(content1);
      //author 2 creates tweet
      await twitter.connect(author2).createTweet(content2);
    });
    it("Should return the correct tweets", async () => {
      //any user can fetch tweets
      const tweets = await twitter.getTweets();
      expect(tweets).to.be.an("array").that.has.length(2);
      const tweet1 = tweets[0];
      const tweet2 = tweets[1];
      //latest tweet is at the top
      expect(tweet1.createdAt).to.be.above(tweet2.createdAt);
      //latest tweet1 is at the top
      expect(tweet1.id).to.equal(id2);
      expect(tweet1.content).to.equal(content2);
      //latest tweet2 should be at the bottom
      expect(tweet2.id).to.equal(id1);
      expect(tweet2.content).to.equal(content1);
    });
    it("Should return only undeleted tweets", async () => {
      //author 1 deletes tweet
      await twitter.connect(author1).deleteTweet(id1);
      //any user can fetch tweets

      const tweets = await twitter.getTweets();
      expect(tweets).to.be.an("array").that.has.length(1);
      expect(tweets[0].id).to.equal(id2);
      expect(tweets[0].content).to.equal(content2);
    });
  });
});
