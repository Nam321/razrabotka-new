BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Movie] (
    [actors] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [director] NVARCHAR(1000) NOT NULL,
    [genre] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [thumbnailUrl] NVARCHAR(1000),
    [id] INT NOT NULL IDENTITY(1,1),
    [year] INT NOT NULL,
    CONSTRAINT [Movie_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Rating] (
    [title] NVARCHAR(1000) NOT NULL,
    [author] NVARCHAR(1000) NOT NULL,
    [rating] INT NOT NULL,
    [date] DATETIME2 NOT NULL,
    [opinion] NVARCHAR(1000) NOT NULL,
    [id] INT NOT NULL IDENTITY(1,1),
    [movieId] INT NOT NULL,
    CONSTRAINT [Rating_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Rating] ADD CONSTRAINT [Rating_movieId_fkey] FOREIGN KEY ([movieId]) REFERENCES [dbo].[Movie]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
