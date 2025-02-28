import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler'
import { ThrottlerStorageOptions } from '@nestjs/throttler/dist/throttler-storage-options.interface'

@Injectable()
export class FirebaseThrottlerGuard extends ThrottlerGuard {
    async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
        const client = context.switchToWs().getClient()
        const ip = client.socket.remoteAddress
        const key = this.generateKey(context, ip)
        this.storageService.increment(key, ttl);
        const ttls: Record<string, ThrottlerStorageOptions> =  this.storageService.storage;
        console.log(ttls);

        if (ttls[key].totalHits > limit) {
            throw new ThrottlerException()
        }

        return true;
    }
}
