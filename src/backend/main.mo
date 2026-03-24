import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Auth logic
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  module DonationRecord {
    public func compare(donation1 : DonationRecord, donation2 : DonationRecord) : Order.Order {
      switch (Text.compare(donation1.donorName, donation2.donorName)) {
        case (#equal) { Int.compare(donation1.timestamp, donation2.timestamp) };
        case (order) { order };
      };
    };

    public func compareByAmount(donation1 : DonationRecord, donation2 : DonationRecord) : Order.Order {
      switch (Text.compare(donation1.amount, donation2.amount)) {
        case (#equal) { compare(donation1, donation2) };
        case (order) { order };
      };
    };
  };

  public type DonationRecord = {
    donorName : Text;
    amount : Text;
    currency : Text;
    paymentMethod : Text;
    timestamp : Int;
    transactionId : ?Text;
  };

  let donationRecords = Map.empty<Text, DonationRecord>();

  // Public query - anyone can view donations for transparency
  public query func getAllDonationRecords() : async [DonationRecord] {
    donationRecords.values().toArray().sort();
  };

  // Public query - anyone can view donations sorted by amount
  public query func getDonationRecordsByAmount() : async [DonationRecord] {
    donationRecords.values().toArray().sort(DonationRecord.compareByAmount);
  };

  // Admin-only: Recording donations should be restricted to prevent fake records
  // In production, this would typically be called internally after payment verification
  public shared ({ caller }) func recordDonation(donation : DonationRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record donations");
    };
    let id = donation.timestamp.toText() # "-" # donation.donorName;
    donationRecords.add(id, donation);
  };

  // Stripe integration logic
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // Admin-only: Setting Stripe configuration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfiguration := ?config;
  };

  // Public query - anyone can check if Stripe is configured
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured.") };
      case (?config) { config };
    };
  };

  // Public function - anyone (including guests) can check their session status
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Public function - anyone (including guests) can create checkout session to donate
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Public query - transform function for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
