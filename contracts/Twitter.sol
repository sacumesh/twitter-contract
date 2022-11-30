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

  // tweet schema data store
  struct Tweet {
    uint256 id;
    address author;
    string content;
    uint256 createdAt;
    uint256 updatedAt;
    uint256 deletedAt;
    bool isDeleted;
  }

  // tweet response
  struct TweetResponse {
    uint256 id;
    address author;
    string content;
    uint256 createdAt;
    uint256 updatedAt;
  }

  uint256 public tweetCount;

  mapping(uint256 => Tweet) private tweets;

  constructor() {}

  /*
   * @dev A function that will create a tweet from a given content and add it to the tweets mapping
   * @param _content The content of the tweet
   */
  function createTweet(
    string memory _content
  ) external isNotEmpty(_content) isNotLongerThan280(_content) {
    tweetCount++;
    tweets[tweetCount] = Tweet({
      id: tweetCount,
      author: msg.sender,
      content: _content,
      createdAt: block.timestamp,
      updatedAt: 0,
      deletedAt: 0,
      isDeleted: false
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
  )
    external
    isNotEmpty(_content)
    isValid(_id)
    isAuthor(_id)
    isNotDeleted(_id)
    isNotLongerThan280(_content)
  {
    Tweet storage tweet = tweets[_id];
    tweet.content = _content;
    tweet.updatedAt = block.timestamp;
  }

  /*
   * @dev A function that marks a tweet with given id DELETED
   * @param _id The id of the tweet
   */
  function deleteTweet(
    uint256 _id
  ) external isValid(_id) isAuthor(_id) isNotDeleted(_id) {
    Tweet storage tweet = tweets[_id];
    tweet.isDeleted = true;
    tweet.deletedAt = block.timestamp;
  }

  /*
   * @dev A function that returns a tweet with a given id. Main purpose is to unit test the contract
   * @param _id The id of the tweet
   * @return TweetResponse matching the given id
   */
  function getTweet(
    uint256 _id
  )
    external
    view
    isValid(_id)
    isNotDeleted(_id)
    returns (TweetResponse memory)
  {
    Tweet memory _tweet = tweets[_id];
    TweetResponse memory _tweetResponse = TweetResponse({
      id: _tweet.id,
      author: _tweet.author,
      content: _tweet.content,
      createdAt: _tweet.createdAt,
      updatedAt: _tweet.updatedAt
    });
    return _tweetResponse;
  }

  /*
   * @dev A function that returns the tweets in the tweets mapping
   * @param _id The id of the tweet
   * @return Returns only the tweets that are not deleted
   */
  function getTweets() external view returns (TweetResponse[] memory) {
    Tweet[] memory _tweets = new Tweet[](tweetCount);
    uint256 counter = 0;
    for (uint256 i = 0; i < tweetCount; i++) {
      if (tweets[i + 1].isDeleted == false) {
        _tweets[counter] = tweets[i + 1];
        counter++;
      }
    }

    TweetResponse[] memory _results = new TweetResponse[](counter);
    for (uint256 i = 0; i < counter; i++) {
      Tweet memory _tweet = _tweets[counter - 1 - i];
      _results[i] = TweetResponse({
        id: _tweet.id,
        author: _tweet.author,
        content: _tweet.content,
        createdAt: _tweet.createdAt,
        updatedAt: _tweet.updatedAt
      });
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
   * @dev A modifier that checks if the tweet content is not longer than 280 characters
   * @param _id The id of the tweet
   */
  modifier isNotLongerThan280(string memory _content) {
    require(bytes(_content).length <= 280, "Tweet content is too long");
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
   * @dev A modifier that checks if the tweet is not deleted
   * @param _id The id of the tweet
   */
  modifier isNotDeleted(uint256 _id) {
    require(tweets[_id].isDeleted == false, "Tweet deleted");
    _;
  }
}
