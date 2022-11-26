// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Twitter {
  /*
   * @title Decentretized Twitter Clone
   * @authors Epita
   * @notice You can use this contract for only the most basic CRUD operations
   */

  enum TweetStatus {
    CREATED,
    UPDATED,
    DELETED
  }

  struct Tweet {
    uint256 id;
    address author;
    string content;
    TweetStatus status;
    uint256 timestamp;
  }

  uint256 public tweetCount;

  mapping(uint256 => Tweet) private tweets;

  constructor() {}

  /*
   * @dev A function that will create a tweet from a given content and add it to the tweets mapping
   * @param _content The content of the tweet
   */
  function createTweet(string memory _content) external isNotEmpty(_content) {
    tweetCount++;
    tweets[tweetCount] = Tweet({
      id: tweetCount,
      author: msg.sender,
      content: _content,
      status: TweetStatus.CREATED,
      timestamp: block.timestamp
    });
  }

  /*
   * @dev A function that will update a tweet whos with a given content in the tweets mapping.
   * @param _id The id of the tweet
   * @param _content The new content of the tweet
   */
  function updateTweet(
    uint256 _id,
    string memory _content
  ) external isNotEmpty(_content) isValid(_id) isAuthor(_id) isNotDeleted(_id) {
    Tweet storage tweet = tweets[_id];
    tweet.content = _content;
    tweet.status = TweetStatus.UPDATED;
    tweet.timestamp = block.timestamp;
  }

  /*
   * @dev A function that marks a tweet with given id DELETED
   * @param _id The id of the tweet
   */
  function deleteTweet(
    uint256 _id
  ) external isValid(_id) isAuthor(_id) isNotDeleted(_id) {
    Tweet storage tweet = tweets[_id];
    tweet.status = TweetStatus.DELETED;
    tweet.timestamp = block.timestamp;
  }

  /*
   * @dev A function that returns a tweet with a given id
   * @param _id The id of the tweet
   */
  function getTweet(
    uint256 _id
  ) external view isValid(_id) isNotDeleted(_id) returns (Tweet memory) {
    return tweets[_id];
  }

  /*
   * @dev A function that returns the tweets in the tweets mapping
   * @param _id The id of the tweet
   * @return Returns only the tweets that are not DELETED
   */
  function getTweets() external view returns (Tweet[] memory) {
    Tweet[] memory _tweets = new Tweet[](tweetCount);
    uint256 counter = 0;
    for (uint256 i = 0; i < tweetCount; i++) {
      if (tweets[i + 1].status != TweetStatus.DELETED) {
        _tweets[counter] = tweets[i + 1];
        counter++;
      }
    }

    Tweet[] memory _results = new Tweet[](counter);
    for (uint256 i = 0; i < counter; i++) {
      _results[i] = _tweets[i];
    }
    return _results;
  }

  /*
   * @dev A modifier that checks if the caller is the author of the tweet
   * @param _content The Author of the tweet
   */
  modifier isAuthor(uint256 _id) {
    require(tweets[_id].author == msg.sender, "Not authorized");
    _;
  }

  /*
   * @dev A modifier that checks if the content is not not empty
   * @param _content The content of the tweet
   */
  modifier isNotEmpty(string memory _content) {
    require(bytes(_content).length > 0, "Tweet content is empty");
    _;
  }

  /*
   * @dev A modifier that checks if the tweet id is valid
   * @param _id The id of the tweet
   */
  modifier isValid(uint256 _id) {
    require((0 < _id && _id <= tweetCount), "Tweet not found");
    _;
  }

  /*
   * @dev A modifier that checks if the tweet is not DELETED
   * @param _id The id of the tweet
   */
  modifier isNotDeleted(uint256 _id) {
    require(tweets[_id].status != TweetStatus.DELETED, "Tweet deleted");
    _;
  }
}
