if exists(select 1 from sys.tables where [name] = 'tblCurricularUnits')
	drop table dbo.tblCurricularUnits
if exists(select 1 from sys.tables where [name] = 'tblUsers')
	drop table dbo.tblUsers
if exists(select 1 from sys.tables where [name] = 'tblProfiles')
	drop table dbo.tblProfiles
if exists(select 1 from sys.tables where [name] = 'tblConfiguration')
	drop table dbo.tblConfiguration
go

create table dbo.tblConfiguration (ApplicationId uniqueidentifier rowguidcol not null, SchoolName varchar(250) not null, [Configuration] varchar(max))
create table dbo.tblProfiles (ProfileId tinyint identity(1,1) not null, ProfileName varchar(50) not null, constraint PK_tblProfiles primary key clustered(ProfileId))
create table dbo.tblUsers (UserId uniqueidentifier rowguidcol not null, [Name] varchar(250) not null, Email varchar(100) not null, [Password] varchar(50) not null, Salt varchar(50) not null, ProfileId tinyint not null, constraint PK_tblUsers primary key clustered(UserId))
create table dbo.tblCurricularUnits (CurricularUnitId uniqueidentifier rowguidcol not null, CurricularUnit varchar(100) not null, constraint PK_tblCurricularUnits primary key clustered(CurricularUnitId))
go

alter table dbo.tblConfiguration add constraint DF_tblConfiguration_ApplicationId default (newid()) for ApplicationId
alter table dbo.tblUsers add constraint DF_tblUsers_UserId default (newid()) for UserId
alter table dbo.tblCurricularUnits add constraint DF_tblCurricularUnits_CurricularUnitId default (newid()) for CurricularUnitId

alter table dbo.tblUsers with check add constraint FK_tblUsers_tblProfiles foreign key(ProfileId) references dbo.tblProfiles(ProfileId)
alter table dbo.tblUsers check constraint FK_tblUsers_tblProfiles

alter table dbo.tblConfiguration with check add constraint isJsonValid check (isjson(Configuration) = 1)
alter table dbo.tblConfiguration check constraint isJsonValid
go

insert into dbo.tblProfiles (ProfileName) values ('Docente'), ('Aluno'), ('Administrador')
go
insert into dbo.tblUsers ([Name], Email, ProfileId) values ('Sérgio Cardoso - D', 'cardoso.sergio@outlook.com', 1), ('Sérgio Cardoso - A', 'a32263@alunos.isel.pt', 2), ('Sérgio Cardoso - Adm', 'cardoso.sergio@gmail.com', 3)
go
insert into dbo.tblCurricularUnits (CurricularUnit) values
	('Projeto e Seminário'), ('Álgebra Linear e Geometria Analítica'), ('Eletrónica'), ('Lógica e Sistemas Digitais'), ('Matemática I'), ('Programação'), ('Arquitetura de Computadores'),
	('Laboratório de Informática e Computadores'), ('Matemática II'), ('Probabilidades e Estatística'), ('Programação Orientada por Objectos'), ('Algoritmos e Estruturas de Dados'),
	('Comunicações'), ('Programação em Sistemas Computacionais'), ('Sistemas de Informação I'), ('Ambientes Virtuais de Execução'), ('Laboratório de Software'), ('Redes de Computadores'),
	('Sistemas Operativos'), ('Programação Concorrente'), ('Programação na Internet'), ('Sistemas de Informação II')
go

-- procedures
if exists(select 1 from sys.procedures where name = 'spGetCurricularUnits')
	drop procedure dbo.spGetCurricularUnits
if exists(select 1 from sys.procedures where name = 'spSetCurricularUnits')
	drop procedure dbo.spSetCurricularUnits
if exists(select 1 from sys.procedures where name = 'spGetConfiguration')
	drop procedure dbo.spGetConfiguration
if exists(select 1 from sys.procedures where name = 'spSetConfiguration')
	drop procedure dbo.spSetConfiguration
if exists(select 1 from sys.procedures where name = 'spGetUser')
	drop procedure dbo.spGetUser
if exists(select 1 from sys.procedures where name = 'spSetUser')
	drop procedure dbo.spSetUser
if exists(select 1 from sys.procedures where name = 'spGetUserPassword')
	drop procedure dbo.spGetUserPassword
go

create procedure dbo.spGetCurricularUnits
as
	set nocount on;

	select CurricularUnitId, CurricularUnit
	from dbo.tblCurricularUnits
	order by 2
go

create procedure dbo.spSetCurricularUnits
(
 @CurricularUnitId uniqueidentifier = null,
 @CurricularUnit varchar(100)
)
as
	set nocount on;

	declare @Id uniqueidentifier = @CurricularUnitId

	if @CurricularUnitId is null
	begin
		declare @insert table(id uniqueidentifier)

		insert into dbo.tblCurricularUnits (CurricularUnit)
		output inserted.CurricularUnitId into @insert
		values (@CurricularUnit)

		select @Id = id from @insert
	end
	else
	begin
		update dbo.tblCurricularUnits set
			CurricularUnit = @CurricularUnit
		where CurricularUnitId = @CurricularUnitId
	end

	select @Id 'CurricularUnitId'
go

create procedure dbo.spGetConfiguration
(
 @ApplicationId uniqueidentifier = null
)
as
	set nocount on;

	select SchoolName, Configuration
	from tblConfiguration
	where @ApplicationId is null or (@ApplicationId is not null and ApplicationId = @ApplicationId)
go

create procedure dbo.spSetConfiguration
(
 @ApplicationId uniqueidentifier,
 @SchoolName varchar(250),
 @Configuration varchar(max)
)
as
	set nocount on;

	update tblConfiguration set
		SchoolName = @SchoolName,
		[Configuration] = @Configuration
	where ApplicationId = @ApplicationId
go

create procedure dbo.spGetUser
(
 @UserId uniqueidentifier
)
as
	set nocount on;

	select [Name], Email, [Password], Salt, ProfileId
	from tblUsers
	where UserId = @UserId
go

create procedure dbo.spSetUser
(
 @UserId uniqueidentifier = null,
 @Name varchar(250),
 @Email varchar(100),
 @Password varchar(50),
 @Salt varchar(50),
 @ProfileId tinyint
)
as
	set nocount on;

	declare @id uniqueidentifier = @UserId

	if @UserId is null
	begin
		declare @insert table(userId uniqueidentifier)

		insert into dbo.tblUsers ([Name], Email, [Password], Salt, ProfileId)
		output inserted.UserId into @insert
		values (@Name, @Email, @Password, @Salt, @ProfileId)

		select @id = userId from @insert
	end
	else
	begin
		update tblUsers set
			[Name] = @Name,
			Email = @Email,
			[Password] = @Password,
			Salt = @Salt,
			ProfileId = @ProfileId
		where UserId = @UserId
	end
	
	select @id
go

create procedure dbo.spGetUserPassword
(
 @Email varchar(100)
)
as
	set nocount on;

	select [Password], Salt
	from dbo.tblUsers
	where Email = @Email and ProfileId = 3 -- Administrator
go
