import { Request, Response, NextFunction } from "express";
import { WalletService } from "../Services/WalletService";


const _walletService = new WalletService();

export const WalletController = {
    async createBallance(req: Request, res: Response, next: NextFunction) {
        try{
            const { ammount, type, walletId } = req.body;

            if(!ammount)
                return res.status(400).send({ isSuccess: false, error: { message: "Ammount is required" }});

            if(ammount == 0)
                return res.status(400).send({ isSuccess: false, error: { message: "Ammount need be different then 0" }});

            if(!type)
                return res.status(400).send({ isSuccess: false, error: { message: "Type is required" }});

            if(!walletId)
                return res.status(400).send({ isSuccess: false, error: { message: "Wallet is required" }});

            var walletValidation = await _walletService.getWallet(walletId);

            if(walletValidation == null)
                return res.status(400).send({ isSuccess: false, error: { message: "Incorrect wallet" }});

            if((walletValidation.balance + ammount) < 0)
                return res.status(400).send({ isSuccess: false, error: { message: "Wallet don't have money for this action" }});

            await _walletService.createTransaction({walletId: walletId, type: type, amount: ammount});

            const updatadWallet = await _walletService.updateWallet(walletValidation.userId, (walletValidation.balance + ammount));

            res.status(200).send({ isSuccess: true, error: null, wallet: updatadWallet});
            return next();
        }
        catch(err){
            return res.status(500).send({ isSuccess: false, error: err});
        }
    }
}