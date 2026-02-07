import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Float "mo:core/Float";
import List "mo:core/List";
import Timer "mo:core/Timer";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  module GameRunState {
    public type T = { #start; #running; #gameOver };
  };

  type GameRunState = GameRunState.T;

  type PlayerProfile = {
    displayName : ?Text;
    totalCoins : Nat;
    bestScores : BestScores;
    lastPlayed : Time.Time;
    cityLayout : ?[[StructureType]];
    farmPlots : ?[[?CropType]];
    minigameScores : ?MinigameScores;
    bestTime : ?Nat;
    battleStats : ?BattleStats;
  };

  type GameState = {
    mode : GameMode;
    state : GameRunState;
    score : Nat;
    coinsEarned : Nat;
  };

  type BattleStats = {
    winsCount : Nat;
    bestStreak : Nat;
  };

  module StructureType {
    public type T = {
      #house;
      #shop;
      #park;
    };

    public func compare(a : T, b : T) : Order.Order {
      switch (a, b) {
        case (#house, #house) { #equal };
        case (#shop, #shop) { #equal };
        case (#park, #park) { #equal };
        case (#house, _) { #less };
        case (#shop, #house) { #greater };
        case (#shop, #park) { #less };
        case (#park, _) { #greater };
      };
    };
  };

  type StructureType = StructureType.T;

  module CropType {
    public type T = {
      #wheat;
      #carrot;
      #tomato;
    };

    public func compare(a : T, b : T) : Order.Order {
      switch (a, b) {
        case (#wheat, #wheat) { #equal };
        case (#carrot, #carrot) { #equal };
        case (#tomato, #tomato) { #equal };
        case (#wheat, _) { #less };
        case (#carrot, #wheat) { #greater };
        case (#carrot, #tomato) { #less };
        case (#tomato, _) { #greater };
      };
    };
  };

  type CropType = CropType.T;

  type MinigameScores = {
    reactionGame : Nat;
    puzzleGame : Nat;
  };

  type GameMode = {
    #endlessRun;
    #cityBuilder;
    #farming;
    #indoor;
    #car;
    #battle;
  };

  module BestScores {
    public type T = {
      endlessRun : Nat;
      cityBuilder : Nat;
      farming : Nat;
      indoor : Nat;
      car : Nat;
      battle : Nat;
    };

    public func compare(a : T, b : T) : Order.Order {
      let scoreA = a.endlessRun + a.cityBuilder + a.farming + a.indoor + a.car + a.battle;
      let scoreB = b.endlessRun + b.cityBuilder + b.farming + b.indoor + b.car + b.battle;
      Nat.compare(scoreA, scoreB);
    };
  };

  type BestScores = BestScores.T;

  type LastPlayed = {
    endlessRun : ?Time.Time;
    cityBuilder : ?Time.Time;
    farming : ?Time.Time;
    indoor : ?Time.Time;
    car : ?Time.Time;
    battle : ?Time.Time;
  };

  let playerData = Map.empty<Principal, PlayerProfile>();
  var globalGameState : ?GameState = null;

  // Persistent Player Logic
  public shared ({ caller }) func createOrUpdatePlayerData(displayName : ?Text) : async () {
    switch (playerData.get(caller)) {
      case (null) {
        let newProfile : PlayerProfile = {
          displayName;
          totalCoins = 0;
          bestScores = {
            endlessRun = 0;
            cityBuilder = 0;
            farming = 0;
            indoor = 0;
            car = 0;
            battle = 0;
          };
          lastPlayed = Time.now();
          cityLayout = null;
          farmPlots = null;
          minigameScores = null;
          bestTime = null;
          battleStats = null;
        };
        playerData.add(caller, newProfile);
      };
      case (?profile) {
        let updatedProfile : PlayerProfile = {
          profile with displayName;
        };
        playerData.add(caller, updatedProfile);
      };
    };
  };

  // Game loop logic
  public shared ({ caller }) func startGame(mode : GameMode) : async GameRunState {
    globalGameState := ?{
      mode;
      state = #running;
      score = 0;
      coinsEarned = 0;
    };
    #running;
  };

  public shared ({ caller }) func updateGame(score : Nat) : async GameRunState {
    switch (globalGameState) {
      case (null) { Runtime.trap("No game in progress") };
      case (?_) {
        globalGameState := globalGameState.map(
          func(state) {
            {
              state with
              score;
              coinsEarned = score / 10;
            };
          }
        );
        #running;
      };
    };
  };

  public shared ({ caller }) func endGame() : async GameRunState {
    switch (globalGameState) {
      case (null) { Runtime.trap("No game in progress") };
      case (?state) {
        switch (playerData.get(caller)) {
          case (null) { Runtime.trap("Player data not found") };
          case (?profile) {
            let updatedProfile : PlayerProfile = {
              profile with
              totalCoins = profile.totalCoins + state.coinsEarned;
              bestScores = updateBestScores(profile.bestScores, state.mode, state.score);
              lastPlayed = Time.now();
            };
            playerData.add(caller, updatedProfile);
          };
        };
        globalGameState := null;
        #gameOver;
      };
    };
  };

  func updateBestScores(bestScores : BestScores, mode : GameMode, newScore : Nat) : BestScores {
    switch (mode) {
      case (#endlessRun) { { bestScores with endlessRun = Nat.max(bestScores.endlessRun, newScore) } };
      case (#cityBuilder) { { bestScores with cityBuilder = Nat.max(bestScores.cityBuilder, newScore) } };
      case (#farming) { { bestScores with farming = Nat.max(bestScores.farming, newScore) } };
      case (#indoor) { { bestScores with indoor = Nat.max(bestScores.indoor, newScore) } };
      case (#car) { { bestScores with car = Nat.max(bestScores.car, newScore) } };
      case (#battle) { { bestScores with battle = Nat.max(bestScores.battle, newScore) } };
    };
  };

  public query ({ caller }) func getPlayerData(user : Principal) : async PlayerProfile {
    switch (playerData.get(user)) {
      case (null) { Runtime.trap("Player not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getGlobalGameState() : async ?GameState {
    globalGameState;
  };
};
