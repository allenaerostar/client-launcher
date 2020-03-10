# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator

DATE_FIELD_DEFAULT = "0000-00-00"
DATE_TIME_FIELD_DEFAULT = "0000-00-00 00:00:00"


class ZeroDateTimeField(models.DateTimeField):
    def get_db_prep_value(self, value, connection, prepared=False):
        if value != DATE_TIME_FIELD_DEFAULT:
            value = super(ZeroDateTimeField, self).get_db_prep_value(value, connection, prepared)

        if value is None:
            return DATE_TIME_FIELD_DEFAULT

        return value

    
class ZeroDateField(models.DateField):
    def get_db_prep_value(self, value, connection, prepared=False):
        if value != DATE_FIELD_DEFAULT:
            value = super(ZeroDateField, self).get_db_prep_value(value, connection, prepared)

        if value is None:
            return DATE_FIELD_DEFAULT

        return value


class AccountsManager(BaseUserManager):

    use_in_migrations = True

    def __create_user(self, username, password, email, birthday, admin_level):
        if not username:
            raise ValueError("Username must be set.")
        if not email:
            raise ValueError("Email must be set.")
        if not password:
            raise ValueError("Password must be set")
        if not birthday:
            raise ValueError("Birthday must be set.")

        account = self.model(name=username, password=password, email=email, birthday=birthday, adminlevel=admin_level)
        account.save(using=self._db)

        return account

    def create_user(self, username, password, email, birthday):
        return self.__create_user(username, password, email, birthday, 0)

    def create_superuser(self, username, password, email, birthday, admin_level):
        return self.__create_user(username, password, email, birthday, admin_level)


class Accounts(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(unique=True, max_length=13)
    password = models.CharField(max_length=128)
    salt = models.CharField(max_length=128, blank=True, null=True)
    pin = models.CharField(max_length=10, blank=True, null=True)
    pic = models.CharField(max_length=26, blank=True, null=True)
    loggedin = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    last_login = models.DateTimeField(db_column='lastlogin', blank=True, null=True)
    createdat = models.DateTimeField(auto_now_add=True)
    birthday = ZeroDateField(blank=True, null=True)
    banned = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    banreason = models.TextField(blank=True, null=True)
    gm = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    macs = models.TextField(blank=True, null=True)
    nxcredit = models.IntegerField(db_column='nxCredit', blank=True, null=True)  # Field name made lowercase.
    maplepoint = models.IntegerField(db_column='maplePoint', blank=True, null=True)  # Field name made lowercase.
    nxprepaid = models.IntegerField(db_column='nxPrepaid', blank=True, null=True)  # Field name made lowercase.
    characterslots = models.IntegerField(default=5, validators=[MinValueValidator(0), MaxValueValidator(250)])
    gender = models.IntegerField(default=10, validators=[MinValueValidator(0), MaxValueValidator(250)])
    tempban = ZeroDateTimeField(blank=True, null=True)
    greason = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    tos = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    sitelogged = models.TextField(blank=True, null=True)
    webadmin = models.IntegerField(default=0, blank=True, null=True)
    nick = models.CharField(max_length=20, blank=True, null=True)
    mute = models.IntegerField(default=0, blank=True, null=True)
    email = models.CharField(unique=True, max_length=45, blank=True, null=True)
    ip = models.TextField(blank=True, null=True)
    rewardpoints = models.IntegerField(default=0)
    hwid = models.CharField(default='', max_length=12)
    fly = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    verified = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(250)])
    adminlevel = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    USERNAME_FIELD = 'name'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['birthday']

    objects = AccountsManager()

    @property
    def is_active(self):
        return bool(self.verified != 0)

    @property
    def is_superuser(self):
        return bool(self.adminlevel > 0)

    @property
    def is_staff(self):
        return bool(self.adminlevel > 0)

    @property
    def get_admin_level(self):
        return self.adminlevel
    

    def check_password(self, raw_password):
        return self.password == raw_password

    class Meta:
        managed = False
        db_table = 'accounts'

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
