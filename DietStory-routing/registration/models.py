# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
import datetime

class Accounts(models.Model):
    name = models.CharField(unique=True, max_length=13)
    password = models.CharField(max_length=128)
    salt = models.CharField(max_length=128, blank=True, null=True)
    pin = models.CharField(max_length=10, blank=True, null=True)
    pic = models.CharField(max_length=26, blank=True, null=True)
    loggedin = models.IntegerField(default=0)
    lastlogin = models.DateTimeField(blank=True, null=True)
    createdat = models.DateTimeField(auto_now_add=True)
    birthday = models.DateField(blank=True, null=True)
    banned = models.IntegerField(default=0)
    banreason = models.TextField(blank=True, null=True)
    gm = models.IntegerField(default=0)
    macs = models.TextField(blank=True, null=True)
    nxcredit = models.IntegerField(db_column='nxCredit', blank=True, null=True)  # Field name made lowercase.
    maplepoint = models.IntegerField(db_column='maplePoint', blank=True, null=True)  # Field name made lowercase.
    nxprepaid = models.IntegerField(db_column='nxPrepaid', blank=True, null=True)  # Field name made lowercase.
    characterslots = models.IntegerField(default=5)
    gender = models.IntegerField(default=10)
    tempban = models.DateTimeField(default=datetime.datetime(1, 1, 1, 0, 0))
    greason = models.IntegerField(default=0)
    tos = models.IntegerField(default=0)
    sitelogged = models.TextField(blank=True, null=True)
    webadmin = models.IntegerField(default=0, blank=True, null=True)
    nick = models.CharField(max_length=20, blank=True, null=True)
    mute = models.IntegerField(default=0, blank=True, null=True)
    email = models.CharField(max_length=45, blank=True, null=True)
    ip = models.TextField(blank=True, null=True)
    rewardpoints = models.IntegerField(default=0)
    hwid = models.CharField(default='', max_length=12)
    fly = models.IntegerField(default=0)

    class Meta:
        managed = False
        db_table = 'accounts'


class Alliance(models.Model):
    name = models.CharField(max_length=13)
    capacity = models.PositiveIntegerField()
    notice = models.CharField(max_length=20)
    rank1 = models.CharField(max_length=11)
    rank2 = models.CharField(max_length=11)
    rank3 = models.CharField(max_length=11)
    rank4 = models.CharField(max_length=11)
    rank5 = models.CharField(max_length=11)

    class Meta:
        managed = False
        db_table = 'alliance'


class Allianceguilds(models.Model):
    allianceid = models.IntegerField()
    guildid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'allianceguilds'


class AreaInfo(models.Model):
    charid = models.IntegerField()
    area = models.IntegerField()
    info = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'area_info'


class BbsReplies(models.Model):
    replyid = models.AutoField(primary_key=True)
    threadid = models.PositiveIntegerField()
    postercid = models.PositiveIntegerField()
    timestamp = models.BigIntegerField()
    content = models.CharField(max_length=26)

    class Meta:
        managed = False
        db_table = 'bbs_replies'


class BbsThreads(models.Model):
    threadid = models.AutoField(primary_key=True)
    postercid = models.PositiveIntegerField()
    name = models.CharField(max_length=26)
    timestamp = models.BigIntegerField()
    icon = models.PositiveSmallIntegerField()
    replycount = models.PositiveSmallIntegerField()
    startpost = models.TextField()
    guildid = models.PositiveIntegerField()
    localthreadid = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'bbs_threads'


class Buddies(models.Model):
    characterid = models.IntegerField()
    buddyid = models.IntegerField()
    pending = models.IntegerField()
    group = models.CharField(max_length=17, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'buddies'


class Characters(models.Model):
    accountid = models.IntegerField()
    world = models.IntegerField()
    name = models.CharField(max_length=13)
    level = models.IntegerField()
    exp = models.IntegerField()
    gachaexp = models.IntegerField()
    str = models.IntegerField()
    dex = models.IntegerField()
    luk = models.IntegerField()
    int = models.IntegerField()
    hp = models.IntegerField()
    mp = models.IntegerField()
    maxhp = models.IntegerField()
    maxmp = models.IntegerField()
    meso = models.IntegerField()
    hpmpused = models.PositiveIntegerField(db_column='hpMpUsed')  # Field name made lowercase.
    job = models.IntegerField()
    skincolor = models.IntegerField()
    gender = models.IntegerField()
    fame = models.IntegerField()
    fquest = models.IntegerField()
    hair = models.IntegerField()
    face = models.IntegerField()
    ap = models.IntegerField()
    sp = models.CharField(max_length=128)
    map = models.IntegerField()
    spawnpoint = models.IntegerField()
    gm = models.IntegerField()
    party = models.IntegerField()
    buddycapacity = models.IntegerField(db_column='buddyCapacity')  # Field name made lowercase.
    createdate = models.DateTimeField()
    rank = models.PositiveIntegerField()
    rankmove = models.IntegerField(db_column='rankMove')  # Field name made lowercase.
    jobrank = models.PositiveIntegerField(db_column='jobRank')  # Field name made lowercase.
    jobrankmove = models.IntegerField(db_column='jobRankMove')  # Field name made lowercase.
    guildid = models.PositiveIntegerField()
    guildrank = models.PositiveIntegerField()
    messengerid = models.PositiveIntegerField()
    messengerposition = models.PositiveIntegerField()
    mountlevel = models.IntegerField()
    mountexp = models.IntegerField()
    mounttiredness = models.IntegerField()
    omokwins = models.IntegerField()
    omoklosses = models.IntegerField()
    omokties = models.IntegerField()
    matchcardwins = models.IntegerField()
    matchcardlosses = models.IntegerField()
    matchcardties = models.IntegerField()
    merchantmesos = models.IntegerField(db_column='MerchantMesos', blank=True, null=True)  # Field name made lowercase.
    hasmerchant = models.IntegerField(db_column='HasMerchant', blank=True, null=True)  # Field name made lowercase.
    equipslots = models.IntegerField()
    useslots = models.IntegerField()
    setupslots = models.IntegerField()
    etcslots = models.IntegerField()
    familyid = models.IntegerField(db_column='familyId')  # Field name made lowercase.
    monsterbookcover = models.IntegerField()
    alliancerank = models.IntegerField(db_column='allianceRank')  # Field name made lowercase.
    vanquisherstage = models.PositiveIntegerField(db_column='vanquisherStage')  # Field name made lowercase.
    dojopoints = models.PositiveIntegerField(db_column='dojoPoints')  # Field name made lowercase.
    lastdojostage = models.PositiveIntegerField(db_column='lastDojoStage')  # Field name made lowercase.
    finisheddojotutorial = models.PositiveIntegerField(db_column='finishedDojoTutorial')  # Field name made lowercase.
    vanquisherkills = models.PositiveIntegerField(db_column='vanquisherKills')  # Field name made lowercase.
    summonvalue = models.PositiveIntegerField(db_column='summonValue')  # Field name made lowercase.
    partnerid = models.IntegerField(db_column='partnerId')  # Field name made lowercase.
    reborns = models.IntegerField()
    pqpoints = models.IntegerField(db_column='PQPoints')  # Field name made lowercase.
    datastring = models.CharField(db_column='dataString', max_length=64)  # Field name made lowercase.
    lastlogouttime = models.DateTimeField(db_column='lastLogoutTime')  # Field name made lowercase.
    pendantexp = models.IntegerField(db_column='pendantExp')  # Field name made lowercase.
    jailexpire = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'characters'


class Cooldowns(models.Model):
    charid = models.IntegerField()
    skillid = models.IntegerField(db_column='SkillID')  # Field name made lowercase.
    length = models.BigIntegerField()
    starttime = models.BigIntegerField(db_column='StartTime')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'cooldowns'


class DropData(models.Model):
    id = models.BigAutoField(primary_key=True)
    dropperid = models.IntegerField()
    itemid = models.IntegerField()
    minimum_quantity = models.IntegerField()
    maximum_quantity = models.IntegerField()
    questid = models.IntegerField()
    chance = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'drop_data'
        unique_together = (('dropperid', 'itemid'),)


class DropDataGlobal(models.Model):
    id = models.BigAutoField(primary_key=True)
    continent = models.IntegerField()
    droptype = models.IntegerField(db_column='dropType')  # Field name made lowercase.
    itemid = models.IntegerField()
    minimum_quantity = models.IntegerField()
    maximum_quantity = models.IntegerField()
    questid = models.IntegerField()
    chance = models.IntegerField()
    comments = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'drop_data_global'


class Dueyitems(models.Model):
    packageid = models.ForeignKey('Dueypackages', models.DO_NOTHING, db_column='PackageId')  # Field name made lowercase.
    itemid = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    upgradeslots = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    str = models.IntegerField(blank=True, null=True)
    dex = models.IntegerField(blank=True, null=True)
    int = models.IntegerField(blank=True, null=True)
    luk = models.IntegerField(blank=True, null=True)
    hp = models.IntegerField(blank=True, null=True)
    mp = models.IntegerField(blank=True, null=True)
    watk = models.IntegerField(blank=True, null=True)
    matk = models.IntegerField(blank=True, null=True)
    wdef = models.IntegerField(blank=True, null=True)
    mdef = models.IntegerField(blank=True, null=True)
    acc = models.IntegerField(blank=True, null=True)
    avoid = models.IntegerField(blank=True, null=True)
    hands = models.IntegerField(blank=True, null=True)
    speed = models.IntegerField(blank=True, null=True)
    jump = models.IntegerField(blank=True, null=True)
    owner = models.CharField(max_length=13, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'dueyitems'


class Dueypackages(models.Model):
    packageid = models.AutoField(db_column='PackageId', primary_key=True)  # Field name made lowercase.
    recieverid = models.PositiveIntegerField(db_column='RecieverId')  # Field name made lowercase.
    sendername = models.CharField(db_column='SenderName', max_length=13)  # Field name made lowercase.
    mesos = models.PositiveIntegerField(db_column='Mesos', blank=True, null=True)  # Field name made lowercase.
    timestamp = models.CharField(db_column='TimeStamp', max_length=10)  # Field name made lowercase.
    checked = models.PositiveIntegerField(db_column='Checked', blank=True, null=True)  # Field name made lowercase.
    type = models.PositiveIntegerField(db_column='Type')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'dueypackages'


class Eventstats(models.Model):
    characterid = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=11)
    info = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'eventstats'


class Famelog(models.Model):
    famelogid = models.AutoField(primary_key=True)
    characterid = models.ForeignKey(Characters, models.DO_NOTHING, db_column='characterid')
    characterid_to = models.IntegerField()
    when = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'famelog'


class FamilyCharacter(models.Model):
    cid = models.IntegerField(primary_key=True)
    familyid = models.IntegerField()
    rank = models.IntegerField()
    reputation = models.IntegerField()
    todaysrep = models.IntegerField()
    totaljuniors = models.IntegerField()
    name = models.CharField(max_length=255)
    juniorsadded = models.IntegerField()
    totalreputation = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'family_character'


class Gifts(models.Model):
    to = models.IntegerField()
    from_field = models.CharField(db_column='from', max_length=13)  # Field renamed because it was a Python reserved word.
    message = models.TextField()
    sn = models.PositiveIntegerField()
    ringid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'gifts'


class Guilds(models.Model):
    guildid = models.AutoField(primary_key=True)
    leader = models.PositiveIntegerField()
    gp = models.PositiveIntegerField(db_column='GP')  # Field name made lowercase.
    logo = models.PositiveIntegerField(blank=True, null=True)
    logocolor = models.PositiveSmallIntegerField(db_column='logoColor')  # Field name made lowercase.
    name = models.CharField(max_length=45)
    rank1title = models.CharField(max_length=45)
    rank2title = models.CharField(max_length=45)
    rank3title = models.CharField(max_length=45)
    rank4title = models.CharField(max_length=45)
    rank5title = models.CharField(max_length=45)
    capacity = models.PositiveIntegerField()
    logobg = models.PositiveIntegerField(db_column='logoBG', blank=True, null=True)  # Field name made lowercase.
    logobgcolor = models.PositiveSmallIntegerField(db_column='logoBGColor')  # Field name made lowercase.
    notice = models.CharField(max_length=101, blank=True, null=True)
    signature = models.IntegerField()
    allianceid = models.PositiveIntegerField(db_column='allianceId')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'guilds'


class Hiredmerchant(models.Model):
    ownerid = models.IntegerField(blank=True, null=True)
    itemid = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    upgradeslots = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    str = models.IntegerField(blank=True, null=True)
    dex = models.IntegerField(blank=True, null=True)
    int = models.IntegerField(blank=True, null=True)
    luk = models.IntegerField(blank=True, null=True)
    hp = models.IntegerField(blank=True, null=True)
    mp = models.IntegerField(blank=True, null=True)
    watk = models.IntegerField(blank=True, null=True)
    matk = models.IntegerField(blank=True, null=True)
    wdef = models.IntegerField(blank=True, null=True)
    mdef = models.IntegerField(blank=True, null=True)
    acc = models.IntegerField(blank=True, null=True)
    avoid = models.IntegerField(blank=True, null=True)
    hands = models.IntegerField(blank=True, null=True)
    speed = models.IntegerField(blank=True, null=True)
    jump = models.IntegerField(blank=True, null=True)
    owner = models.CharField(max_length=13, blank=True, null=True)
    type = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'hiredmerchant'


class Htsquads(models.Model):
    channel = models.PositiveIntegerField()
    leaderid = models.PositiveIntegerField()
    status = models.PositiveIntegerField()
    members = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'htsquads'


class Hwidbans(models.Model):
    hwidbanid = models.AutoField(primary_key=True)
    hwid = models.CharField(unique=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'hwidbans'


class Inventoryequipment(models.Model):
    inventoryequipmentid = models.AutoField(primary_key=True)
    inventoryitemid = models.PositiveIntegerField()
    upgradeslots = models.IntegerField()
    level = models.IntegerField()
    str = models.IntegerField()
    dex = models.IntegerField()
    int = models.IntegerField()
    luk = models.IntegerField()
    hp = models.IntegerField()
    mp = models.IntegerField()
    watk = models.IntegerField()
    matk = models.IntegerField()
    wdef = models.IntegerField()
    mdef = models.IntegerField()
    acc = models.IntegerField()
    avoid = models.IntegerField()
    hands = models.IntegerField()
    speed = models.IntegerField()
    jump = models.IntegerField()
    locked = models.IntegerField()
    vicious = models.PositiveIntegerField()
    itemlevel = models.IntegerField()
    itemexp = models.PositiveIntegerField()
    ringid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'inventoryequipment'


class Inventoryitems(models.Model):
    inventoryitemid = models.AutoField(primary_key=True)
    type = models.PositiveIntegerField()
    characterid = models.IntegerField(blank=True, null=True)
    accountid = models.IntegerField(blank=True, null=True)
    itemid = models.IntegerField()
    inventorytype = models.IntegerField()
    position = models.IntegerField()
    quantity = models.IntegerField()
    owner = models.TextField()
    petid = models.IntegerField()
    flag = models.IntegerField()
    expiration = models.BigIntegerField()
    giftfrom = models.CharField(db_column='giftFrom', max_length=26)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'inventoryitems'


class Ipbans(models.Model):
    ipbanid = models.AutoField(primary_key=True)
    ip = models.CharField(max_length=40)
    aid = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ipbans'


class Iplog(models.Model):
    iplogid = models.AutoField(primary_key=True)
    accountid = models.IntegerField()
    ip = models.CharField(max_length=30)
    login = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'iplog'


class Keymap(models.Model):
    characterid = models.IntegerField()
    key = models.IntegerField()
    type = models.IntegerField()
    action = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'keymap'


class Macbans(models.Model):
    macbanid = models.AutoField(primary_key=True)
    mac = models.CharField(unique=True, max_length=30)
    aid = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'macbans'


class Macfilters(models.Model):
    macfilterid = models.AutoField(primary_key=True)
    filter = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'macfilters'


class Makercreatedata(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    itemid = models.IntegerField()
    req_level = models.PositiveIntegerField()
    req_maker_level = models.PositiveIntegerField()
    req_meso = models.IntegerField()
    req_item = models.IntegerField()
    req_equip = models.IntegerField()
    catalyst = models.IntegerField()
    quantity = models.SmallIntegerField()
    tuc = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'makercreatedata'
        unique_together = (('id', 'itemid'),)


class Makerrecipedata(models.Model):
    itemid = models.IntegerField(primary_key=True)
    req_item = models.IntegerField()
    count = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'makerrecipedata'
        unique_together = (('itemid', 'req_item'),)


class Makerrewarddata(models.Model):
    itemid = models.IntegerField(primary_key=True)
    rewardid = models.IntegerField()
    quantity = models.SmallIntegerField()
    prob = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'makerrewarddata'
        unique_together = (('itemid', 'rewardid'),)


class Marriages(models.Model):
    marriageid = models.AutoField(primary_key=True)
    husbandid = models.PositiveIntegerField()
    wifeid = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'marriages'


class Medalmaps(models.Model):
    queststatusid = models.PositiveIntegerField()
    mapid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'medalmaps'


class Monsterbook(models.Model):
    charid = models.PositiveIntegerField()
    cardid = models.IntegerField()
    level = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'monsterbook'


class Monstercarddata(models.Model):
    cardid = models.IntegerField()
    mobid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'monstercarddata'


class MtsCart(models.Model):
    cid = models.IntegerField()
    itemid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'mts_cart'


class MtsItems(models.Model):
    tab = models.IntegerField()
    type = models.IntegerField()
    itemid = models.PositiveIntegerField()
    quantity = models.IntegerField()
    seller = models.IntegerField()
    price = models.IntegerField()
    bid_incre = models.IntegerField(blank=True, null=True)
    buy_now = models.IntegerField(blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)
    upgradeslots = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    str = models.IntegerField(blank=True, null=True)
    dex = models.IntegerField(blank=True, null=True)
    int = models.IntegerField(blank=True, null=True)
    luk = models.IntegerField(blank=True, null=True)
    hp = models.IntegerField(blank=True, null=True)
    mp = models.IntegerField(blank=True, null=True)
    watk = models.IntegerField(blank=True, null=True)
    matk = models.IntegerField(blank=True, null=True)
    wdef = models.IntegerField(blank=True, null=True)
    mdef = models.IntegerField(blank=True, null=True)
    acc = models.IntegerField(blank=True, null=True)
    avoid = models.IntegerField(blank=True, null=True)
    hands = models.IntegerField(blank=True, null=True)
    speed = models.IntegerField(blank=True, null=True)
    jump = models.IntegerField(blank=True, null=True)
    locked = models.IntegerField(blank=True, null=True)
    isequip = models.IntegerField(blank=True, null=True)
    owner = models.CharField(max_length=16, blank=True, null=True)
    sellername = models.CharField(max_length=16)
    sell_ends = models.CharField(max_length=16)
    transfer = models.IntegerField(blank=True, null=True)
    vicious = models.PositiveIntegerField()
    flag = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'mts_items'


class Notes(models.Model):
    to = models.CharField(max_length=13)
    from_field = models.CharField(db_column='from', max_length=13)  # Field renamed because it was a Python reserved word.
    message = models.TextField()
    timestamp = models.BigIntegerField()
    fame = models.IntegerField()
    deleted = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'notes'


class Nxcode(models.Model):
    code = models.CharField(primary_key=True, max_length=15)
    valid = models.IntegerField()
    user = models.CharField(max_length=13, blank=True, null=True)
    type = models.IntegerField()
    item = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'nxcode'


class Nxcoupons(models.Model):
    couponid = models.IntegerField()
    rate = models.IntegerField()
    activeday = models.IntegerField()
    starthour = models.IntegerField()
    endhour = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'nxcoupons'


class Petignores(models.Model):
    petid = models.PositiveIntegerField()
    itemid = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'petignores'


class Pets(models.Model):
    petid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=13, blank=True, null=True)
    level = models.PositiveIntegerField()
    closeness = models.PositiveIntegerField()
    fullness = models.PositiveIntegerField()
    summoned = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'pets'


class Playernpcs(models.Model):
    name = models.CharField(max_length=13)
    hair = models.IntegerField()
    face = models.IntegerField()
    skin = models.IntegerField()
    x = models.IntegerField()
    cy = models.IntegerField()
    map = models.IntegerField()
    gender = models.IntegerField()
    dir = models.IntegerField()
    scriptid = models.PositiveIntegerField(db_column='ScriptId')  # Field name made lowercase.
    foothold = models.IntegerField(db_column='Foothold')  # Field name made lowercase.
    rx0 = models.IntegerField()
    rx1 = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'playernpcs'


class PlayernpcsEquip(models.Model):
    npcid = models.IntegerField(db_column='NpcId')  # Field name made lowercase.
    equipid = models.IntegerField()
    type = models.IntegerField()
    equippos = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'playernpcs_equip'


class Questactions(models.Model):
    questactionid = models.AutoField(primary_key=True)
    questid = models.IntegerField()
    status = models.IntegerField()
    data = models.TextField()

    class Meta:
        managed = False
        db_table = 'questactions'


class Questprogress(models.Model):
    queststatusid = models.PositiveIntegerField()
    progressid = models.IntegerField()
    progress = models.CharField(max_length=15)

    class Meta:
        managed = False
        db_table = 'questprogress'


class Questrequirements(models.Model):
    questrequirementid = models.AutoField(primary_key=True)
    questid = models.IntegerField()
    status = models.IntegerField()
    data = models.TextField()

    class Meta:
        managed = False
        db_table = 'questrequirements'


class Queststatus(models.Model):
    queststatusid = models.AutoField(primary_key=True)
    characterid = models.IntegerField()
    quest = models.IntegerField()
    status = models.IntegerField()
    time = models.IntegerField()
    expires = models.BigIntegerField()
    forfeited = models.IntegerField()
    info = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'queststatus'


class Reactordrops(models.Model):
    reactordropid = models.AutoField(primary_key=True)
    reactorid = models.IntegerField()
    itemid = models.IntegerField()
    chance = models.IntegerField()
    questid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'reactordrops'


class Reports(models.Model):
    reporttime = models.DateTimeField()
    reporterid = models.IntegerField()
    victimid = models.IntegerField()
    reason = models.IntegerField()
    chatlog = models.TextField()
    status = models.TextField()

    class Meta:
        managed = False
        db_table = 'reports'


class Responses(models.Model):
    chat = models.TextField(blank=True, null=True)
    response = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'responses'


class Rings(models.Model):
    partnerringid = models.IntegerField(db_column='partnerRingId')  # Field name made lowercase.
    partnerchrid = models.IntegerField(db_column='partnerChrId')  # Field name made lowercase.
    itemid = models.IntegerField()
    partnername = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'rings'


class Savedlocations(models.Model):
    characterid = models.IntegerField()
    locationtype = models.CharField(max_length=11)
    map = models.IntegerField()
    portal = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'savedlocations'


class ServerQueue(models.Model):
    accountid = models.IntegerField()
    characterid = models.IntegerField()
    type = models.IntegerField()
    value = models.IntegerField()
    message = models.CharField(max_length=128)
    createtime = models.DateTimeField(db_column='createTime')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'server_queue'


class Shopitems(models.Model):
    shopitemid = models.AutoField(primary_key=True)
    shopid = models.PositiveIntegerField()
    itemid = models.IntegerField()
    price = models.IntegerField()
    pitch = models.IntegerField()
    position = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'shopitems'


class Shops(models.Model):
    shopid = models.AutoField(primary_key=True)
    npcid = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'shops'


class Skillmacros(models.Model):
    characterid = models.IntegerField()
    position = models.IntegerField()
    skill1 = models.IntegerField()
    skill2 = models.IntegerField()
    skill3 = models.IntegerField()
    name = models.CharField(max_length=13, blank=True, null=True)
    shout = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'skillmacros'


class Skills(models.Model):
    skillid = models.IntegerField()
    characterid = models.IntegerField()
    skilllevel = models.IntegerField()
    masterlevel = models.IntegerField()
    expiration = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'skills'


class Specialcashitems(models.Model):
    id = models.IntegerField(primary_key=True)
    sn = models.IntegerField()
    modifier = models.IntegerField()
    info = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'specialcashitems'


class Storages(models.Model):
    storageid = models.AutoField(primary_key=True)
    accountid = models.IntegerField()
    world = models.IntegerField()
    slots = models.IntegerField()
    meso = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'storages'


class Trocklocations(models.Model):
    trockid = models.AutoField(primary_key=True)
    characterid = models.IntegerField()
    mapid = models.IntegerField()
    vip = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'trocklocations'


class UltimateAdventurers(models.Model):
    successorid = models.IntegerField(db_column='successorId')  # Field name made lowercase.
    cygnusid = models.IntegerField(db_column='cygnusId', unique=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ultimate_adventurers'


class Wishlists(models.Model):
    charid = models.IntegerField()
    sn = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'wishlists'


class Zaksquads(models.Model):
    channel = models.PositiveIntegerField()
    leaderid = models.PositiveIntegerField()
    status = models.PositiveIntegerField()
    members = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'zaksquads'
