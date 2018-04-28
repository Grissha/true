  /**
* @param {org.truevote.setVote} tx
* @transaction
*/
async function onAcceptTrade(tx) {

//
const vr = await getParticipantRegistry('org.truevote.Voter');
//
const cr = await getParticipantRegistry('org.truevote.Candidate');
//
const br = await getAssetRegistry('org.truevote.Bulletin');
const cor = await getParticipantRegistry('org.truevote.Counter');
//
const candidate = await cr.get(tx.bulletin.candidate.getIdentifier());
const counter = await cor.get(tx.bulletin.counter.getIdentifier());

// ,
if (!tx.voter.vote) {
throw new Error("Have not vote");
}

//
tx.voter.vote = false;
//
candidate.votes += 1;
//
tx.bulletin.Party = candidate.Party;

//
await vr.update(tx.voter);
//
await cr.update(candidate);
//
await br.update(tx.bulletin);

//
const factory = getFactory();
counter.count += 1;
await cor.update(counter);
var number = counter.count;
var name = 'Bulletin' + number;
var bulletinNew = factory.newResource('org.truevote', 'Bulletin', name);

//
bulletinNew.FIO = candidate.FIO;
bulletinNew.Party = candidate.Party;
bulletinNew.bulletinId = candidate.candidateId;
bulletinNew.movementStatus = 'IN_FIELD';
bulletinNew.candidate = candidate;
bulletinNew.bulletinId = name;
bulletinNew.counter = counter;

//
await br.add(bulletinNew);
}

//////////////////////////////////////////////////////////////////////
/**
* @param {org.truevote.SetupDemo} setupDemo
* @transaction
*/
async function setupDemo(setupDemo) {
//
const factory = getFactory();
// namespace
const NS = 'org.truevote';

//
const vr = await getParticipantRegistry('org.truevote.Voter');
const cr = await getParticipantRegistry('org.truevote.Candidate');
const br = await getAssetRegistry('org.truevote.Bulletin');
const cor = await getParticipantRegistry('org.truevote.Counter');

var counters = [
  factory.newResource(NS, 'Counter', 'Counter1')
];

//
var candidates = [
factory.newResource(NS, 'Candidate', 'Candidate1@village.com'),
factory.newResource(NS, 'Candidate', 'Candidate2@village.com'),
factory.newResource(NS, 'Candidate', 'Candidate3@village.com'),
];

//
var bulletins = [
factory.newResource(NS, 'Bulletin', 'Bulletin1'),
factory.newResource(NS, 'Bulletin', 'Bulletin2'),
factory.newResource(NS, 'Bulletin', 'Bulletin3'),
];

// create animals
var voters = [
factory.newResource(NS, 'Voter', 'Voter1'),
factory.newResource(NS, 'Voter', 'Voter2'),
factory.newResource(NS, 'Voter', 'Voter3'),
factory.newResource(NS, 'Voter', 'Voter4'),
factory.newResource(NS, 'Voter', 'Voter5'),
factory.newResource(NS, 'Voter', 'Voter6'),
factory.newResource(NS, 'Voter', 'Voter7'),
factory.newResource(NS, 'Voter', 'Voter8'),
factory.newResource(NS, 'Voter', 'Voter9'),
];

counters[0].count = 3;
await cor.addAll(counters);

//
candidates[0].FIO = 'Ivanov';
candidates[0].Party = 'Left';
candidates[0].votes = 0;

candidates[1].FIO = 'Petrov';
candidates[1].Party = 'Center';
candidates[1].votes = 0;

candidates[2].FIO = 'Sobolev';
candidates[2].Party = 'Right';
candidates[2].votes = 0;

//
await cr.addAll(candidates);

//
bulletins[0].FIO = 'Ivanov';
bulletins[0].Party = 'Left';
bulletins[0].movementStatus = 'IN_TRANSIT';
bulletins[0].candidate = factory.newRelationship(NS, 'Candidate', candidates[0].candidateId);
bulletins[0].counter = factory.newRelationship(NS, 'Counter', counters[0].counterId);

bulletins[1].FIO = 'Petrov';
bulletins[1].Party = 'Center';
bulletins[1].movementStatus = 'IN_TRANSIT';
bulletins[1].candidate = factory.newRelationship(NS, 'Candidate',candidates[1].candidateId);
bulletins[1].counter = factory.newRelationship(NS, 'Counter', counters[0].counterId);

bulletins[2].FIO = 'Sobolev';
bulletins[2].Party = 'Right';
bulletins[2].movementStatus = 'IN_TRANSIT';
bulletins[2].candidate = factory.newRelationship(NS, 'Candidate', candidates[2].candidateId);
bulletins[2].counter = factory.newRelationship(NS, 'Counter', counters[0].counterId);

//
await br.addAll(bulletins);

//
voters[0].FIO = 'Molly';
voters[0].vote = true;

voters[1].FIO = 'Polly';
voters[1].vote = true;

voters[2].FIO = 'Dolly';
voters[2].vote = true;

voters[3].FIO = 'Kolly';
voters[3].vote = true;

voters[4].FIO = 'Rolly';
voters[4].vote = true;

voters[5].FIO = 'Tolly';
voters[5].vote = true;

voters[6].FIO = 'Ivanov';
voters[6].vote = true;

voters[7].FIO = 'Petrov';
voters[7].vote = true;

voters[8].FIO = 'Sobolev';
voters[8].vote = true;

//
await vr.addAll(voters);
}
