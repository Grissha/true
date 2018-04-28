/**
 * @param {org.truevote.setVote} tx
 * @transaction
 */
async function onAcceptTrade(tx) {

  // получаем регистр избирателей
  const vr = await getParticipantRegistry('org.truevote.Voter');
  // получаем регистр кандидатов
  const cr = await getParticipantRegistry('org.truevote.Candidate');
  // получаем регистр биллютеней
  const br = await getAssetRegistry('org.truevote.Bulletin');
  // кандидат
  const candidate = await cr.get(tx.bulletin.candidate.getIdentifier());

  // если избиратель уже проголосовал, товыкидываем ошибку
  if (!tx.voter.vote) {
    throw new Error("Have not vote");
  }

  // снимаём со счёта избирателя голос
  tx.voter.vote = false;
  // добавляем голос кандидату
  candidate.votes += 1;
  // заполняем биллютень
  tx.bulletin.Party = candidate.Party;
  // биллютень оффициально продан
  tx.bulletin.movementStatus = 'IN_FIELD';

  // обновляем избирателя
  await vr.update(tx.voter);
  // обновляем кандидата
  await cr.update(candidate);
  // обновляем биллютень
  await br.update(tx.bulletin);

  // создаём новый биллютень
  const factory = getFactory();
  var mas = tx.bulletin.getIdentifier().split('n');
  var name = 'Bulletin' + mas[1] + '0';
  var bulletinNew = factory.newResource('org.truevote', 'Bulletin', name);

  // подготавливаем новый биллютень
  bulletinNew.FIO = candidate.FIO;
  bulletinNew.Party =  candidate.Party;
  bulletinNew.bulletinId =  candidate.candidateId;
  bulletinNew.movementStatus = 'IN_TRANSIT';
  bulletinNew.candidate = candidate;
  bulletinNew.bulletinId = name;

  // добавляем новый биллютень
  await br.add(bulletinNew);
}

//////////////////////////////////////////////////////////////////////
/**
 * @param {org.truevote.setupDemo} setupDemo
 * @transaction
 */
async function setupDemo(setupDemo) {
  // конструктор объектов
  const factory = getFactory();
  // наш namespace
  const NS = 'org.truevote';

  // получаем регистры
  const vr = await getParticipantRegistry('org.truevote.Voter');
  const cr = await getParticipantRegistry('org.truevote.Candidate');
  const br = await getAssetRegistry('org.truevote.Bulletin');

  // Создаём кандидатов
  var candidates = [
    factory.newResource(NS, 'Candidate', 'Candidate1@village.com'),
    factory.newResource(NS, 'Candidate', 'Candidate2@village.com'),
    factory.newResource(NS, 'Candidate', 'Candidate3@village.com'),
  ];

  // Создаём начальные биллютени
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

  // заполняем кандидатов
  candidates[0].FIO = 'Ivanov';
  candidates[0].Party = 'Left';
  candidates[0].votes = 0;

  candidates[1].FIO = 'Petrov';
  candidates[1].Party = 'Center';
  candidates[1].votes = 0;

  candidates[2].FIO = 'Sobolev';
  candidates[2].Party = 'Right';
  candidates[2].votes = 0;

  // добавляем кандидатов в регистр
  await cr.addAll(candidates);

  // заполняем биллютени
  bulletins[0].FIO = 'Ivanov';
  bulletins[0].Party = 'Left';
  bulletins[0].movementStatus = 'IN_TRANSIT';
  bulletins[0].candidate = factory.newRelationship(NS, 'Candidate', candidates[0].candidateId);

  bulletins[1].FIO = 'Petrov';
  bulletins[1].Party = 'Center';
  bulletins[1].movementStatus = 'IN_TRANSIT';
  bulletins[1].candidate = factory.newRelationship(NS, 'Candidate', candidates[1].candidateId);

  bulletins[2].FIO = 'Sobolev';
  bulletins[2].Party = 'Right';
  bulletins[2].movementStatus = 'IN_TRANSIT';
  bulletins[2].candidate = factory.newRelationship(NS, 'Candidate', candidates[2].candidateId);

  // добавляем бюллитени в регистр
  await br.addAll(bulletins);

  // заполняем избирателей
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

  // добавляем кандидатов в регистр
  await vr.addAll(voters);
}
