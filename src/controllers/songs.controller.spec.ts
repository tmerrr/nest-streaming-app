// import { Test, TestingModule } from '@nestjs/testing';
// import { SongsController } from './songs.controller';
// import { SongsService } from './songs.service';

// describe('SongsController', () => {
//   let songsController: SongsController;

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       controllers: [SongsController],
//       providers: [SongsService],
//     }).compile();

//     songsController = app.get<SongsController>(SongsController);
//   });

//   describe('root', () => {
//     it('should return "Hello World!"', () => {
//       expect(songsController.getHello()).toBe('Hello World!');
//     });
//   });
// });