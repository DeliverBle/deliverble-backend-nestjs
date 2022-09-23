import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let authservice: AuthService;
  let repository: AuthRepository;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { 
          provide: getRepositoryToken(AuthRepository),
          useValue: {
            // save: jest.fn().mockResolvedValue(mockNews),
            // find: jest.fn().mockRejectedValue([mockNews]),
          }
        }
      ],
    }).compile();

    authservice = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authservice).toBeDefined();
  });

  it("should be 4", () => {
    expect(2+2).toEqual(4);
  })

  // it("should be 8", () => {
  //   expect(2+2).toEqual(8);
  // })
});
